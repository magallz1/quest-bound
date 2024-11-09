import { useParams } from 'react-router-dom';
import {
  archetypes,
  deleteArchetype as deleteArchetypeMutation,
  DeleteArchetypeMutation,
  DeleteArchetypeMutationVariables,
} from '../../gql';
import { useMutation } from '../../utils';
import { useError } from '../metrics';

export const useDeleteArchetype = () => {
  const { rulesetId } = useParams();

  const [mutation, { error, loading }] = useMutation<
    DeleteArchetypeMutation,
    DeleteArchetypeMutationVariables
  >(deleteArchetypeMutation, {
    refetchQueries: [{ query: archetypes, variables: { rulesetId } }],
    awaitRefetchQueries: true,
  });

  useError({
    error,
    message: 'Failed to delete archetype',
    location: 'useDeleteArchetype',
  });

  const deleteArchetype = async (id: string) => {
    if (!rulesetId) return;
    const res = await mutation({
      variables: {
        input: {
          id,
          rulesetId,
        },
      },
    });

    if (!res.data) {
      throw new Error('Failed to delete archetype');
    }

    return res.data.deleteArchetype;
  };

  return {
    deleteArchetype,
    error,
    loading,
  };
};
