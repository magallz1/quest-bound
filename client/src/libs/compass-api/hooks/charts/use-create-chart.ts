import {
  charts,
  CreateChart,
  createChart as createChartMutation,
  CreateChartMutation,
  CreateChartMutationVariables,
} from '../../gql';
import { useMutation } from '../../utils';
import { useError } from '../metrics';
import { useCharts } from './use-charts';

export const useCreateChart = (rulesetId?: string) => {
  const [mutation, { loading, error }] = useMutation<
    CreateChartMutation,
    CreateChartMutationVariables
  >(createChartMutation);

  useError({
    error,
    message: 'Failed to create chart',
  });

  const { getCharts } = useCharts();

  const createChart = async (input: CreateChart) => {
    let fileKey = input.fileKey;

    const res = await mutation({
      variables: {
        input: {
          ...input,
          fileKey,
        },
      },
      refetchQueries: [{ query: charts, variables: { rulesetId } }],
    });

    if (!res.data?.createChart) {
      throw Error('Failed to create chart');
    }

    return res.data.createChart;
  };

  const createCharts = async (inputs: CreateChart[]) => {
    await Promise.all(
      inputs.map((input, i) => {
        return mutation({
          variables: {
            input,
          },
        });
      }),
    );

    await getCharts();

    return 'success';
  };

  return {
    createChart,
    createCharts,
    loading,
    error,
  };
};
