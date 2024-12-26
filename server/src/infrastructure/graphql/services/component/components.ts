import { AuthorizationContext } from '@/infrastructure/types';
import { SheetComponentsQueryVariables } from '../../generated-types';
import { dbClient } from '@/database';
import { throwIfUnauthorized } from '../_shared';

export const sheetComponents = async (
  parent: any,
  args: SheetComponentsQueryVariables,
  context: AuthorizationContext,
) => {
  const { input } = args;
  const db = dbClient();

  const {
    userPermittedRulesetWriteIds,
    userPermittedRulesetReadIds,
    userPermittedPublishedRulesetReadIds,
    userId,
  } = context;

  let published: boolean | undefined = false;

  if (!!userId) {
    published = throwIfUnauthorized({
      rulesetId: input.rulesetId,
      userPermittedRulesetWriteIds,
      userPermittedRulesetReadIds,
      userPermittedPublishedRulesetReadIds,
    });
  } else if (context.authorizationRequired) {
    // No user is authenticated. Make sure sheet is being streamed.
    const character = await db.character.findFirst({
      where: {
        sheet: { entityId: input.sheetId },
      },
    });

    if (!character?.streamTabId) {
      throw Error('Unauthorized');
    }
  }

  const getComponents = async () => {
    return published
      ? await db.publishedSheetComponent.findMany({
          where: {
            sheetId: `${input.sheetId}-${input.rulesetId}`,
            tabId: input.tabId ?? undefined,
          },
          include: {
            images: {
              include: {
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        })
      : await db.sheetComponent.findMany({
          where: {
            sheetId: `${input.sheetId}-${input.rulesetId}`,
            tabId: input.tabId ?? undefined,
          },
          include: {
            sheet: {
              select: {
                characterId: true,
              },
            },
            images: {
              include: {
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        });
  };

  const components = await getComponents();

  if (!components?.length) {
    if (!published) {
      return components;
    }

    // When fetching a character's sheet, it's possible the user has permissions for the published & non-published rulesets.
    // These entities are never published, so we need to pull them from the non-published tables.

    const nonPublishedComponents = await db.sheetComponent.findMany({
      where: {
        sheetId: `${input.sheetId}-${input.rulesetId}`,
        tabId: input.tabId ?? undefined,
      },
      include: {
        sheet: {
          select: {
            characterId: true,
          },
        },
        images: {
          include: {
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const isCharacterSheet = nonPublishedComponents?.[0]?.sheet?.characterId;
    if (!isCharacterSheet) {
      return components;
    }

    return nonPublishedComponents.map((component: any) => ({
      ...component,
      id: component.entityId,
      rulesetId: input.rulesetId,
      // Return the sheet's entity ID
      sheetId: input.sheetId,
      images: component.images.map((componentImage: any) => componentImage.image),
    }));
  }

  return components.map((component: any) => ({
    ...component,
    id: component.entityId,
    rulesetId: input.rulesetId,
    // Return the sheet's entity ID
    sheetId: input.sheetId,
    images: component.images.map((componentImage: any) => componentImage.image),
  }));
};
