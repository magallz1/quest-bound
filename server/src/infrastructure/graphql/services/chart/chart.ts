import { AuthorizationContext } from '@/infrastructure/types';
import { ChartQueryVariables } from '../../generated-types';
import { dbClient } from '@/database';
import { throwIfUnauthorized } from '../_shared';

export const chart = async (
  parent: any,
  args: ChartQueryVariables,
  context: AuthorizationContext,
) => {
  const {
    userPermittedRulesetWriteIds,
    userPermittedRulesetReadIds,
    userPermittedPublishedRulesetReadIds,
  } = context;

  const { input } = args;

  const db = dbClient();

  const published = throwIfUnauthorized({
    rulesetId: input.rulesetId,
    userPermittedRulesetWriteIds,
    userPermittedRulesetReadIds,
    userPermittedPublishedRulesetReadIds,
  });

  const query = {
    where: {
      id: `${input.id}-${input.rulesetId}`,
    },
    include: {
      ruleset: {
        select: {
          userId: true,
        },
      },
    },
  };

  const getChart = async () => {
    return published ? await db.publishedChart.findUnique(query) : await db.chart.findUnique(query);
  };

  const chart = await getChart();

  if (!chart) {
    throw Error('Chart not found.');
  }

  return {
    ...chart,
    id: chart.entityId,
  };
};
