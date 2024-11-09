import {
  DeletePublishedRulesetMutation,
  deletePublishedRulesetMutation,
  DeletePublishedRulesetMutationVariables,
  PublishRuleset,
  ruleset,
} from '../../gql';
import { useMutation } from '../../utils';
import { useError } from '../metrics';

export const useCancelPublishRuleset = () => {
  const [deleteMutation, { error, loading }] = useMutation<
    DeletePublishedRulesetMutation,
    DeletePublishedRulesetMutationVariables
  >(deletePublishedRulesetMutation);

  useError({
    error,
    message: 'Failed to cancel request',
  });

  const cancelPublishRuleset = async (input: Omit<PublishRuleset, 'version'>) => {
    const res = await deleteMutation({
      variables: {
        input: {
          id: input.id,
        },
      },
      refetchQueries: [{ query: ruleset, variables: { id: input.id } }],
      awaitRefetchQueries: true,
    });

    if (!res.data?.deletePublishedRuleset) {
      throw Error('Failed to publish ruleset');
    }

    return 'success';
  };

  return {
    cancelPublishRuleset,
    loading,
    error,
  };
};
