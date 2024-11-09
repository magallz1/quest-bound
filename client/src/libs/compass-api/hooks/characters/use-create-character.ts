import {
  characters,
  CreateCharacter,
  createCharacter as createCharacterMutation,
  CreateCharacterMutation,
  CreateCharacterMutationVariables,
  Sheet,
} from '../../gql';
import { useMutation } from '../../utils';
import { useError } from '../metrics';
import { useCacheHelpers } from './cache-helpers';

export const useCreateCharacter = () => {
  const [mutation, { error, loading }] = useMutation<
    CreateCharacterMutation,
    CreateCharacterMutationVariables
  >(createCharacterMutation);

  const { createCharacterCacheOnly } = useCacheHelpers();

  useError({
    error,
    message: 'Failed to create character',
    location: 'useCreateCharacter',
  });

  const createCharacter = async (
    input: CreateCharacter,
    opt?: { cacheOnly?: boolean },
    sheet?: Sheet,
  ) => {
    if (opt?.cacheOnly) {
      const char = createCharacterCacheOnly(input, sheet);
      return char;
    }

    const res = await mutation({
      variables: {
        input: {
          ...input,
        },
      },
      refetchQueries: [{ query: characters }],
    });

    if (!res.data?.createCharacter) {
      throw Error('Failed to create character');
    }

    return res.data.createCharacter;
  };

  return {
    createCharacter,
    error,
    loading,
  };
};
