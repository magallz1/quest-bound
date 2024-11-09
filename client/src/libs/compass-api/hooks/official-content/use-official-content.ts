import { officialContent, OfficialContentQuery } from '../../gql';
import { useQuery } from '../../utils';
import { useError } from '../metrics';

export const useOfficialContent = () => {
  const { data, loading, error } = useQuery<OfficialContentQuery>(officialContent);

  useError({
    error,
    message: 'Failed to load Quest Bound content',
    location: 'useOfficialContent',
  });

  return {
    rulesets: data?.officialContent?.rulesets ?? [],
    modules: data?.officialContent?.modules ?? [],
    loading,
    error,
  };
};
