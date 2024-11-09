import { v4 as uuidv4 } from 'uuid';
import { CreateDocumentMutationVariables } from '../../generated-types';
import { AuthorizationContext } from '@/infrastructure/types';
import { dbClient } from '@/database';
import { throwIfUnauthorized } from '../_shared';

export const createDocument = async (
  parent: any,
  args: CreateDocumentMutationVariables,
  context: AuthorizationContext,
) => {
  const { userPermittedRulesetWriteIds, userPermittedRulesetReadIds } = context;

  const { input } = args;

  const db = dbClient();

  const entityId = uuidv4();

  throwIfUnauthorized({
    rulesetId: input.rulesetId,
    userPermittedRulesetWriteIds,
    userPermittedRulesetReadIds,
    role: 'write',
  });

  const document = await db.document.create({
    data: {
      ...input,
      id: `${entityId}-${input.rulesetId}`,
      entityId,
    },
  });

  return {
    ...document,
    id: document.entityId,
  };
};
