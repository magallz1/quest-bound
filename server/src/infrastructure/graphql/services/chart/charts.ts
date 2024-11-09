import { AuthorizationContext } from '@/infrastructure/types';
import { ChartsQueryVariables } from '../../generated-types';
import { dbClient } from '@/database';
import { throwIfUnauthorized } from '../_shared';

export const charts = async (
  parent: any,
  args: ChartsQueryVariables,
  context: AuthorizationContext,
) => {
  const {
    userPermittedRulesetWriteIds,
    userPermittedRulesetReadIds,
    userPermittedPublishedRulesetReadIds,
  } = context;

  const { rulesetId } = args;

  const db = dbClient();

  const published = throwIfUnauthorized({
    rulesetId,
    userPermittedRulesetWriteIds,
    userPermittedRulesetReadIds,
    userPermittedPublishedRulesetReadIds,
  });

  const query = {
    where: {
      AND: {
        rulesetId,
        NOT: {
          id: `archetypes-${rulesetId}`,
        },
      },
    },
    include: {
      ruleset: {
        select: {
          userId: true,
        },
      },
    },
  };

  const getCharts = async () => {
    return published ? await db.publishedChart.findMany(query) : await db.chart.findMany(query);
  };

  const charts = await getCharts();

  return charts.map((chart: any) => ({
    ...chart,
    id: chart.entityId,
  }));
};
