import {
  UpdateRuleset,
  updateRuleset as updateRulesetMutation,
  UpdateRulesetMutation,
  UpdateRulesetMutationVariables,
} from '../../gql';
import { useMutation } from '../../utils';
import { useCacheHelpers } from './cache-helpers';

export const useUpdateRuleset = () => {
  const [mutation, { loading, error }] = useMutation<
    UpdateRulesetMutation,
    UpdateRulesetMutationVariables
  >(updateRulesetMutation);

  const { updateRulesetCacheOnly } = useCacheHelpers();

  const updateRuleset = async (input: UpdateRuleset) => {
    updateRulesetCacheOnly(input);

    const res = await mutation({
      variables: {
        input,
      },
    });

    if (!res.data?.updateRuleset) {
      throw Error('Failed to update ruleset');
    }

    return res.data.updateRuleset;
  };

  return {
    updateRuleset,
    loading,
    error,
  };
};
