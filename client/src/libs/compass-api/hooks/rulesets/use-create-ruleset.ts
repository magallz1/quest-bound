import {
  CreateRuleset,
  createRuleset as createRulesetMutation,
  CreateRulesetMutation,
  CreateRulesetMutationVariables,
  rulesets,
} from '../../gql';
import { useMutation } from '../../utils';
import { useError } from '../metrics';

export const useCreateRuleset = () => {
  const [mutation, { loading, error }] = useMutation<
    CreateRulesetMutation,
    CreateRulesetMutationVariables
  >(createRulesetMutation, {
    refetchQueries: [{ query: rulesets }],
  });

  useError({
    error,
    message: 'Failed to create ruleset',
  });

  const createRuleset = async (input: CreateRuleset) => {
    const res = await mutation({
      variables: {
        input: {
          ...input,
        },
      },
    });

    if (!res.data?.createRuleset) {
      throw Error('Failed to create ruleset');
    }

    return res.data.createRuleset;
  };

  return {
    createRuleset,
    loading,
    error,
  };
};
