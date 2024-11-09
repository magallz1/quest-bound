import { AuthorizationContext } from '@/infrastructure/types';
import { PageQueryVariables } from '../../generated-types';
import { convertEntityId, throwIfUnauthorized } from '../_shared';
import { dbClient } from '@/database';

export const page = async (
  parent: any,
  args: PageQueryVariables,
  context: AuthorizationContext,
) => {
  const { input } = args;
  const { toEntity, fromEntity } = convertEntityId(input.rulesetId);

  const {
    userPermittedRulesetWriteIds,
    userPermittedRulesetReadIds,
    userPermittedPublishedRulesetReadIds,
  } = context;

  const db = dbClient();

  const published = throwIfUnauthorized({
    rulesetId: input.rulesetId,
    userPermittedRulesetWriteIds,
    userPermittedRulesetReadIds,
    userPermittedPublishedRulesetReadIds,
  });

  const query = {
    where: {
      id: fromEntity(input.id),
    },
    include: {
      sheet: {
        include: {
          backgroundImage: true,
        },
      },
    },
  };

  const getPage = async () => {
    return published ? await db.publishedPage.findUnique(query) : await db.page.findUnique(query);
  };

  const page = await getPage();

  if (!page) {
    if (!published) {
      throw Error('Page not found.');
    }

    // When fetching a character's journal, it's possible the user has permissions for the published & non-published rulesets.
    // These entities are never published, so we need to pull them from the non-published tables.

    const nonPublishedPage = await db.page.findUnique(query);

    if (!nonPublishedPage?.characterId) {
      throw Error('Page not found.');
    }

    return {
      ...nonPublishedPage,
      id: nonPublishedPage.entityId,
      parentId: nonPublishedPage.parentId ? toEntity(nonPublishedPage.parentId) : undefined,
      sheetId: nonPublishedPage.sheet?.entityId,
      sheet: {
        ...nonPublishedPage.sheet,
        id: nonPublishedPage.sheet?.entityId,
        username: nonPublishedPage.sheet?.createdBy ?? '',
      },
    };
  }

  if (!page) {
    throw Error('Page not found.');
  }

  return {
    ...page,
    id: page.entityId,
    parentId: page.parentId ? toEntity(page.parentId) : undefined,
    sheetId: page.sheet?.entityId,
    sheet: {
      ...page.sheet,
      id: page.sheet?.entityId,
      username: page.sheet?.createdBy ?? '',
    },
  };
};
