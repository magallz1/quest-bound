import { useParams } from 'react-router-dom';
import { Archetype, archetypes, ArchetypesQuery, ArchetypesQueryVariables } from '../../gql';
import { useQuery } from '../../utils';
import { useError } from '../metrics';

export const useArchetypes = (rulesetIdOverride?: string, forceSkip?: boolean) => {
  const { rulesetId } = useParams();

  const { data, loading, error } = useQuery<ArchetypesQuery, ArchetypesQueryVariables>(archetypes, {
    variables: {
      rulesetId: rulesetIdOverride ?? rulesetId ?? '',
    },
    skip: forceSkip || !rulesetId,
  });

  useError({
    error,
    message: 'Failed to load archetypes',
    location: 'useArchetypes',
  });

  return {
    archetypes: (data?.archetypes ?? []) as Archetype[],
    loading,
    error,
  };
};
