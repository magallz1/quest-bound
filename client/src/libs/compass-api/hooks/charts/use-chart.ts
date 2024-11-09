import { useParams } from 'react-router-dom';
import { Chart, chart as chartQuery, ChartQuery, ChartQueryVariables } from '../../gql';
import { useLazyQuery, useQuery } from '../../utils';
import { useError } from '../metrics';

export const useChart = (id?: string) => {
  const { rulesetId } = useParams();

  const { data, error, loading } = useQuery<ChartQuery, ChartQueryVariables>(chartQuery, {
    variables: {
      input: {
        id: id ?? '',
        rulesetId: rulesetId ?? '',
      },
    },
    skip: !id || !rulesetId,
  });

  useError({
    error,
    message: 'Failed to load chart',
  });

  const [query, { error: lazyError, loading: lazyLoading }] = useLazyQuery<
    ChartQuery,
    ChartQueryVariables
  >(chartQuery);

  useError({
    error: lazyError,
    message: 'Failed to load chart',
  });

  const getChart = async (id: string) => {
    if (!rulesetId) return;
    const res = await query({
      variables: {
        input: {
          id,
          rulesetId,
        },
      },
    });

    if (!res.data?.chart) {
      throw new Error('Failed to load chart');
    }

    return res.data.chart as Chart;
  };

  return {
    chart: data?.chart ?? null,
    getChart,
    loading: loading || lazyLoading,
    error: error || lazyError,
  };
};
