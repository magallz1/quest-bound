import { v4 as uuidv4 } from 'uuid';
import { CreateChartMutationVariables } from '../../generated-types';
import { AuthorizationContext } from '@/infrastructure/types';
import { dbClient, supabaseClient } from '@/database';
import { throwIfUnauthorized } from '../_shared';

export const createChart = async (
  parent: any,
  args: CreateChartMutationVariables,
  context: AuthorizationContext,
) => {
  const { userPermittedRulesetWriteIds, userPermittedRulesetReadIds } = context;

  const { input } = args;

  const db = dbClient();
  const supabase = supabaseClient();

  throwIfUnauthorized({
    rulesetId: input.rulesetId,
    userPermittedRulesetWriteIds,
    userPermittedRulesetReadIds,
    role: 'write',
  });

  const { data } = await supabase.storage.from('charts').download(input.fileKey);

  if (!data) {
    throw Error('Unable to parse chart file');
  }

  const parsedData = await data.text();

  const entityId = uuidv4();

  const chart = await db.chart.create({
    data: {
      ...input,
      id: `${entityId}-${input.rulesetId}`,
      entityId,
      data: JSON.parse(parsedData) as string[][],
    },
  });

  await supabase.storage.from('charts').remove([input.fileKey]);

  return {
    ...chart,
    id: chart.entityId,
  };
};
