import { useParams } from 'react-router-dom';
import {
  addPlaytester as addPlaytesterMutation,
  AddPlaytesterMutation,
  AddPlaytesterMutationVariables,
  ruleset,
} from '../../gql';
import { useMutation } from '../../utils';
import { useError } from '../metrics';

export const useAddPlaytester = () => {
  const { rulesetId } = useParams();

  const [mutation, { loading, error }] = useMutation<
    AddPlaytesterMutation,
    AddPlaytesterMutationVariables
  >(addPlaytesterMutation, {
    refetchQueries: [{ query: ruleset, variables: { id: rulesetId } }],
    awaitRefetchQueries: true,
  });

  const userHasPermissions = error?.message?.includes('User has existing read permissions');

  useError({
    error,
    message: userHasPermissions
      ? 'User already owns the published version of this content'
      : 'Failed to add play tester',
    status: userHasPermissions ? 'info' : 'error',
  });

  const addPlaytester = async (userId: string) => {
    if (!rulesetId) return;
    const res = await mutation({
      variables: {
        input: {
          rulesetId,
          userId,
        },
      },
    });

    return res.data?.addPlaytester;
  };

  return {
    addPlaytester,
    loading,
    error,
  };
};
