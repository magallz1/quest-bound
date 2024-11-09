import { AuthorizationContext } from '@/infrastructure/types';
import { UpdateDocumentMutationVariables } from '../../generated-types';
import { dbClient } from '@/database';
import { throwIfUnauthorized } from '../_shared';

export const updateDocument = async (
  parent: any,
  args: UpdateDocumentMutationVariables,
  context: AuthorizationContext,
) => {
  const { userPermittedRulesetWriteIds, userPermittedRulesetReadIds } = context;

  const { input } = args;

  const db = dbClient();

  throwIfUnauthorized({
    rulesetId: input.rulesetId,
    userPermittedRulesetWriteIds,
    userPermittedRulesetReadIds,
    role: 'write',
  });

  const document = await db.document.update({
    where: {
      id: `${input.id}-${input.rulesetId}`,
    },
    data: {
      title: input.title ?? undefined,
      fileKey: input.fileKey ?? undefined,
    },
  });

  return {
    ...document,
    id: document.entityId,
  };
};
