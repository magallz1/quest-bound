import { AuthorizationContext } from '@/infrastructure/types';
import { DeleteChartMutationVariables } from '../../generated-types';
import { dbClient } from '@/database';
import { convertEntityId, throwIfUnauthorized } from '../_shared';

export const deleteChart = async (
  parent: any,
  args: DeleteChartMutationVariables,
  context: AuthorizationContext,
) => {
  const { userPermittedRulesetWriteIds, userPermittedRulesetReadIds } = context;

  const { input } = args;

  const db = dbClient();
  const { fromEntity } = convertEntityId(input.rulesetId);

  throwIfUnauthorized({
    rulesetId: input.rulesetId,
    userPermittedRulesetWriteIds,
    userPermittedRulesetReadIds,
    role: 'write',
  });

  await db.chart.delete({
    where: {
      id: fromEntity(input.id),
    },
  });

  return `Successfully deleted chart ${input.id}`;
};
