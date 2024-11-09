import { useParams } from 'react-router-dom';
import {
  chart,
  UpdateChart,
  updateChart as updateChartMutation,
  UpdateChartMutation,
  UpdateChartMutationVariables,
} from '../../gql';
import { useMutation } from '../../utils';
import { useError } from '../metrics';
import { useCacheHelpers } from './cache-helpers';

type UpdateChartProps = Omit<UpdateChart, 'rulesetId'>;

export const useUpdateChart = () => {
  const { rulesetId } = useParams();
  const [mutation, { loading, error }] = useMutation<
    UpdateChartMutation,
    UpdateChartMutationVariables
  >(updateChartMutation);

  useError({
    error,
    message: 'Failed to update chart',
  });

  const { updateChartCacheOnly } = useCacheHelpers();

  const updateChart = async (input: UpdateChartProps, chartData?: string[][]) => {
    if (!rulesetId) return;
    updateChartCacheOnly({
      ...input,
      rulesetId,
      data: chartData ? JSON.stringify(chartData) : undefined,
    });

    const res = await mutation({
      variables: {
        input: {
          ...input,
          rulesetId,
          data: chartData ? JSON.stringify(chartData) : undefined,
        },
      },
      fetchPolicy: 'no-cache',
      refetchQueries: [{ query: chart, variables: { input: { id: input.id, rulesetId } } }],
    });

    if (!res.data?.updateChart) {
      throw Error('Failed to update chart');
    }

    return res.data.updateChart;
  };

  return {
    updateChart,
    loading,
    error,
  };
};
