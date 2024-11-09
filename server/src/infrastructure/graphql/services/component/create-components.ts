import { AuthorizationContext } from '@/infrastructure/types';
import { CreateSheetComponentsMutationVariables } from '../../generated-types';
import { dbClient } from '@/database';

export const createSheetComponents = async (
  parent: any,
  args: CreateSheetComponentsMutationVariables,
  context: AuthorizationContext,
) => {
  const { userId } = context;
  const { input } = args;

  const db = dbClient();

  await db.sheetComponent.createMany({
    data: input.map((component) => ({
      id: `${component.id}-${component.sheetId}-${component.rulesetId}`,
      sheetId: `${component.sheetId}-${component.rulesetId}`,
      // Component IDs are made optimisitcally on the client
      entityId: component.id,
      type: component.type,
      label: component.label,
      description: component.description,
      locked: component.locked,
      groupId: component.groupId,
      tabId: component.tabId,
      layer: component.layer,
      style: component.style,
      data: component.data,
      x: component.x,
      y: component.y,
      width: component.width,
      height: component.height,
      rotation: component.rotation,
    })),
  });

  // Can't use connect on a createMany call
  const componentsWithImages = input.filter(
    (component) => !!component.imageIds && component.imageIds?.length > 0,
  );

  await Promise.all(
    componentsWithImages.map((component) =>
      db.componentImages.createMany({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        data: component.imageIds!.map((imageId) => ({
          componentId: `${component.id}-${component.sheetId}-${component.rulesetId}`,
          imageId,
        })),
      }),
    ),
  );

  return input;
};
