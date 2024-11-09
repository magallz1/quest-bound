import { AuthorizationContext } from '@/infrastructure/types';
import { PagesQueryVariables } from '../../generated-types';
import { convertEntityId, throwIfUnauthorized } from '../_shared';
import { dbClient } from '@/database';

export const pages = async (
  parent: any,
  args: PagesQueryVariables,
  context: AuthorizationContext,
) => {
  const { rulesetId } = args;
  const { toEntity } = convertEntityId(rulesetId);

  const {
    userPermittedRulesetWriteIds,
    userPermittedRulesetReadIds,
    userPermittedPublishedRulesetReadIds,
  } = context;

  const db = dbClient();

  const published = throwIfUnauthorized({
    rulesetId,
    userPermittedRulesetWriteIds,
    userPermittedRulesetReadIds,
    userPermittedPublishedRulesetReadIds,
  });

  const query = {
    where: {
      rulesetId,
      ...(!published && { characterId: null }),
    },
    include: {
      sheet: {
        select: {
          entityId: true,
        },
      },
    },
  };

  const getPages = async () => {
    return published ? await db.publishedPage.findMany(query) : await db.page.findMany(query);
  };

  const pages = await getPages();

  return pages.map((page: any) => ({
    ...page,
    id: page.entityId,
    parentId: page.parentId ? toEntity(page.parentId) : undefined,
    sheetId: page.sheet?.entityId,
  }));
};
