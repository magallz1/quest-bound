import { useParams } from 'react-router-dom';
import { Page, pages, PagesQuery, PagesQueryVariables } from '../../gql';
import { useQuery } from '../../utils';
import { useError } from '../metrics';

export const usePages = () => {
  const { rulesetId } = useParams();

  const { data, loading, error } = useQuery<PagesQuery, PagesQueryVariables>(pages, {
    variables: {
      rulesetId: rulesetId ?? '',
    },
    skip: !rulesetId,
  });

  useError({
    error,
    message: 'Failed to load pages',
  });

  return {
    pages: (data?.pages ?? []) as Page[],
    loading,
    error,
  };
};
