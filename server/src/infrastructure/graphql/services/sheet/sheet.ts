import { AuthorizationContext } from '@/infrastructure/types';
import { SheetQueryVariables } from '../../generated-types';
import { dbClient } from '@/database';
import { convertEntityId, throwIfUnauthorized } from '../_shared';

export const sheet = async (
  parent: any,
  args: SheetQueryVariables,
  context: AuthorizationContext,
) => {
  const { input } = args;

  const db = dbClient();
  const { toEntity } = convertEntityId(input.rulesetId);

  const {
    userPermittedRulesetWriteIds,
    userPermittedRulesetReadIds,
    userPermittedPublishedRulesetReadIds,
  } = context;

  // const published = throwIfUnauthorized({
  //   rulesetId: input.rulesetId,
  //   userPermittedRulesetWriteIds,
  //   userPermittedRulesetReadIds,
  //   userPermittedPublishedRulesetReadIds,
  // });

  const published = false;

  const query = {
    where: {
      id: `${input.id}-${input.rulesetId}`,
    },
    include: {
      backgroundImage: true,
      ruleset: true,
      image: true,
    },
  };

  const getSheet = async () => {
    return published ? await db.publishedSheet.findUnique(query) : await db.sheet.findUnique(query);
  };

  const sheet = await getSheet();

  if (!sheet) {
    if (!published) {
      throw Error('Sheet not found.');
    }

    // When fetching a character's journal or sheet, it's possible the user has permissions for the published & non-published rulesets.
    // These entities are never published, so we need to pull them from the non-published tables.

    const nonPublishedSheet = await db.sheet.findUnique({
      where: {
        id: `${input.id}-${input.rulesetId}`,
      },
      include: {
        backgroundImage: true,
        ruleset: true,
        image: true,
        page: {
          select: {
            characterId: true,
          },
        },
      },
    });

    if (!nonPublishedSheet?.page?.characterId && !nonPublishedSheet?.characterId) {
      throw Error('Sheet not found.');
    }

    return {
      ...nonPublishedSheet,
      id: nonPublishedSheet.entityId,
      pageId: nonPublishedSheet.pageId ? toEntity(nonPublishedSheet.pageId) : null,
      templateId: nonPublishedSheet.templateId ? toEntity(nonPublishedSheet.templateId) : null,
      username: nonPublishedSheet.createdBy ?? '',
      rulesetTitle: nonPublishedSheet.ruleset?.title ?? null,
    };
  }

  return {
    ...sheet,
    id: sheet.entityId,
    pageId: sheet.pageId ? toEntity(sheet.pageId) : null,
    templateId: sheet.templateId ? toEntity(sheet.templateId) : null,
    username: sheet.createdBy ?? '',
    rulesetTitle: sheet.ruleset?.title ?? null,
  };
};
