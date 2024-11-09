import { useParams } from 'react-router-dom';
import {
  currentUser,
  removePlaytester as removePlaytesterMutation,
  RemovePlaytesterMutation,
  RemovePlaytesterMutationVariables,
  ruleset,
} from '../../gql';
import { useMutation } from '../../utils';
import { useError } from '../metrics';

export const useRemovePlaytester = () => {
  const { rulesetId } = useParams();

  const [mutation, { loading, error }] = useMutation<
    RemovePlaytesterMutation,
    RemovePlaytesterMutationVariables
  >(removePlaytesterMutation);

  useError({
    error,
    message: 'Failed to remove play tester',
  });

  const removePlaytester = async (userId: string, overrideRulesetId?: string) => {
    if (!rulesetId) return;
    const res = await mutation({
      variables: {
        input: {
          rulesetId: overrideRulesetId ?? rulesetId,
          userId,
        },
      },
      refetchQueries: !!overrideRulesetId
        ? [{ query: currentUser }]
        : [{ query: ruleset, variables: { id: rulesetId } }, { query: currentUser }],
      awaitRefetchQueries: true,
    });

    if (!res.data?.removePlaytester) {
      throw Error('Failed to remove playtester');
    }

    return res.data.removePlaytester;
  };

  return {
    removePlaytester,
    loading,
    error,
  };
};
