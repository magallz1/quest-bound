import { useParams } from 'react-router-dom';
import { pageTemplates, PageTemplatesQuery, PageTemplatesQueryVariables, Sheet } from '../../gql';
import { useQuery } from '../../utils';
import { useError } from '../metrics';

export const usePageTemplates = () => {
  const { rulesetId } = useParams();

  const { data, loading, error } = useQuery<PageTemplatesQuery, PageTemplatesQueryVariables>(
    pageTemplates,
    {
      variables: {
        rulesetId: rulesetId ?? '',
      },
      skip: !rulesetId,
    },
  );

  useError({
    error,
    message: 'Failed to load pages',
  });

  const templates: Sheet[] = data?.pageTemplates ?? [];

  return {
    pages: templates,
    loading,
    error,
  };
};
