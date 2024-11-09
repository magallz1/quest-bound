import { AuthorizationContext } from '@/infrastructure/types';
import { UpdateChartMutationVariables } from '../../generated-types';
import { dbClient, supabaseClient } from '@/database';
import { throwIfUnauthorized } from '../_shared';

export const updateChart = async (
  parent: any,
  args: UpdateChartMutationVariables,
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

  let updatedData: string[][] | undefined;

  if (input.fileKey) {
    const { data } = await supabase.storage.from('charts').download(input.fileKey);

    if (!data) {
      throw Error('Unable to parse chart file');
    }

    const parsedData = await data.text();

    updatedData = JSON.parse(parsedData) as string[][];

    await supabase.storage.from('charts').remove([input.fileKey]);
  }

  const chart = await db.chart.update({
    where: {
      id: `${input.id}-${input.rulesetId}`,
    },
    data: {
      title: input.title ?? undefined,
      fileKey: input.fileKey ?? undefined,
      data: input.data ? JSON.parse(input.data) : updatedData,
    },
  });

  return {
    ...chart,
    id: chart.entityId,
  };
};
