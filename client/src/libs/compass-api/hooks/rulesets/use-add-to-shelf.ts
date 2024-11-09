import {
  addToShelf as addToShelfMutation,
  AddToShelfMutation,
  AddToShelfMutationVariables,
  rulesets,
} from '../../gql';
import { useMutation } from '../../utils';
import { useError } from '../metrics';

export const useAddToShelf = () => {
  const [mutation, { loading, error }] = useMutation<
    AddToShelfMutation,
    AddToShelfMutationVariables
  >(addToShelfMutation, {
    refetchQueries: [{ query: rulesets }],
  });

  useError({
    error,
    message: 'Failed to add ruleset to shelf',
  });

  const addToShelf = async (id: string, isModule?: boolean) => {
    const res = await mutation({
      variables: {
        input: {
          id,
          isModule,
        },
      },
    });

    if (!res.data?.addToShelf) {
      throw Error('Failed to add ruleset to shelf');
    }

    return res.data.addToShelf;
  };

  return {
    addToShelf,
    loading,
    error,
  };
};
