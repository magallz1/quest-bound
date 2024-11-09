import { AuthorizationContext } from '@/infrastructure/types';
import {
  UpdateSheetComponent,
  UpdateSheetComponentsMutationVariables,
} from '../../generated-types';
import { dbClient } from '@/database';
import { pubsub } from '../pubsub';
import { StreamSubscriptionType } from '../subscriptions';

export const updateSheetComponents = async (
  parent: any,
  args: UpdateSheetComponentsMutationVariables,
  context: AuthorizationContext,
) => {
  const { input } = args;

  const db = dbClient();

  const failedUpdateIds: string[] = [];

  const updateImages = async (update: UpdateSheetComponent) => {
    if (update.imageIds) {
      await db.componentImages.createMany({
        data: update.imageIds.map((id) => ({
          componentId: `${update.id}-${update.sheetId}-${update.rulesetId}`,
          imageId: id,
        })),
      });
    }

    if (update.removeImageIds) {
      await db.componentImages.deleteMany({
        where: {
          componentId: `${update.id}-${update.sheetId}-${update.rulesetId}`,
          imageId: {
            in: update.removeImageIds,
          },
        },
      });
    }
  };

  await Promise.allSettled(
    input.map(
      (update) =>
        new Promise<void>(async (res) => {
          await updateImages(update);

          db.sheetComponent
            .update({
              where: {
                id: `${update.id}-${update.sheetId}-${update.rulesetId}`,
              },
              data: {
                label: update.label ?? undefined,
                description: update.description,
                locked: update.locked ?? undefined,
                groupId: update.groupId,
                tabId: update.tabId ?? undefined,
                layer: update.layer ?? undefined,
                style: update.style ?? undefined,
                data: update.data ?? undefined,
                x: update.x ?? undefined,
                y: update.y ?? undefined,
                width: update.width ?? undefined,
                height: update.height ?? undefined,
                rotation: update.rotation ?? undefined,
              },
            })
            .catch(() => {
              failedUpdateIds.push(update.id);
            })
            .then(() => res());
        }),
    ),
  );

  // Request from stream page
  if (input[0]?.characterId) {
    const rulesetId = input[0].rulesetId;
    const sheetId = input[0].sheetId;

    const allComponents = await db.sheetComponent.findMany({
      where: {
        sheetId: `${sheetId}-${rulesetId}`,
      },
      include: {
        images: {
          include: {
            image: true,
          },
        },
      },
    });

    const firstComponent = allComponents.find((c: any) => c.entityId === input[0].id);
    const tabId = firstComponent?.tabId ?? input[0].tabId;

    const tabComponents = allComponents.filter((c: any) => c.tabId === tabId);

    pubsub.publish(`${StreamSubscriptionType.streamComponents}_${rulesetId}_${sheetId}_${tabId}`, {
      streamComponents: tabComponents.map((component: any) => ({
        ...component,
        __typename: 'SheetComponent',
        id: component.entityId,
        sheetId: sheetId,
        rulesetId: rulesetId,
        images: component.images.map((componentImage: any) => componentImage.image),
      })),
    });
  }

  return {
    failedUpdateIds,
  };
};
