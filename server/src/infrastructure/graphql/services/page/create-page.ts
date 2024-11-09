import { AuthorizationContext } from '@/infrastructure/types';
import { CreatePageMutationVariables } from '../../generated-types';
import { convertEntityId, createPageUtil } from '../_shared';
import { dbClient } from '@/database';

export const createPage = async (
  parent: any,
  args: CreatePageMutationVariables,
  context: AuthorizationContext,
) => {
  const { input } = args;
  const { toEntity } = convertEntityId(input.rulesetId);

  const db = dbClient();

  const { page, sheet } = await createPageUtil({ db, input });

  return {
    ...page,
    id: page.entityId,
    parentId: page.parentId ? toEntity(page.parentId) : undefined,
    sheetId: sheet.entityId,
  };
};
