import { AuthorizationContext } from '@/infrastructure/types';
import { DeleteBootstrapMutationVariables } from '../../generated-types';
import { dbClient } from '@/database';
import { throwIfUnauthorized } from '../_shared';

export const deleteBootstrap = async (
  parent: any,
  args: DeleteBootstrapMutationVariables,
  context: AuthorizationContext,
) => {
  const { userPermittedRulesetWriteIds, userPermittedRulesetReadIds } = context;

  const { rulesetId } = args;

  const db = dbClient();

  throwIfUnauthorized({
    rulesetId,
    userPermittedRulesetWriteIds,
    userPermittedRulesetReadIds,
    role: 'write',
  });

  await db.page.deleteMany({
    where: { rulesetId, bootstrapped: true },
  });

  return 'success';
};
