import { AuthorizationContext } from '@/infrastructure/types';
import { dbClient } from '@/database';
import { DeleteArchetypeMutationVariables } from '../../generated-types';
import { convertEntityId, throwIfUnauthorized } from '../_shared';

export const deleteArchetype = async (
  parent: any,
  args: DeleteArchetypeMutationVariables,
  context: AuthorizationContext,
) => {
  const { userPermittedRulesetReadIds, userPermittedRulesetWriteIds } = context;

  const { input } = args;

  const db = dbClient();
  const { fromEntity } = convertEntityId(input.rulesetId);

  throwIfUnauthorized({
    rulesetId: input.rulesetId,
    userPermittedRulesetWriteIds,
    userPermittedRulesetReadIds,
    role: 'write',
  });

  await db.archetype.delete({
    where: {
      id: fromEntity(input.id),
    },
  });

  return `Successfully deleted archetype ${input.id}`;
};
