import {
  permittedRulesets as permittedRulesetsQuery,
  PermittedRulesetsQuery,
  Ruleset,
} from '../../gql';
import { useQuery } from '../../utils';
import { useError } from '../metrics';

/**
 * Returns which rulesets the current user has permission to
 */
export const usePermittedRulesets = (includeOwn = false, pollInterval = 0) => {
  const { data, loading, error } = useQuery<PermittedRulesetsQuery>(permittedRulesetsQuery, {
    pollInterval,
  });

  const permittedRulesets = includeOwn
    ? data?.permittedRulesets ?? []
    : data?.permittedRulesets?.filter((ruleset) => !ruleset.permissions.includes('OWNER')) ?? [];

  useError({
    error,
    message: 'Failed to load rulesets',
  });

  return {
    permittedRulesets: permittedRulesets as Ruleset[],
    loading,
    error,
  };
};
