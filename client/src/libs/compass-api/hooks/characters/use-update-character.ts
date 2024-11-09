import debounce from 'lodash.debounce';
import { useMemo } from 'react';
import {
  character,
  UpdateCharacter,
  updateCharacter as updateCharacterMutation,
  UpdateCharacterMutation,
  UpdateCharacterMutationVariables,
} from '../../gql';
import { AttributeData } from '../../types';
import { useMutation } from '../../utils';
import { useError } from '../metrics';
import { useCacheHelpers } from './cache-helpers';

function parseCharacterAttributeData(raw?: string | null): string | null | undefined {
  if (!raw) return raw;
  const data = JSON.parse(raw) as AttributeData[];

  const update = data.map((attr) => ({
    id: attr.id,
    value: attr.value,
    name: attr.name,
  }));

  return JSON.stringify(update);
}

export const useUpdateCharacter = (debounceTime = 0) => {
  const [mutation, { loading, error }] = useMutation<
    UpdateCharacterMutation,
    UpdateCharacterMutationVariables
  >(updateCharacterMutation);

  const { updateCharacterCacheOnly } = useCacheHelpers();

  const debouncedMutation = useMemo(() => debounce(mutation, debounceTime), []);

  useError({
    error,
    message: 'Failed to update character',
  });

  const updateCharacter = async (
    input: Omit<UpdateCharacter, 'rulesetId'>,
    opt?: { cacheOnly?: boolean },
    refetch?: boolean,
  ) => {
    updateCharacterCacheOnly({ ...input });

    if (opt?.cacheOnly) return 'success';

    await debouncedMutation({
      variables: {
        input: {
          ...input,
          attributeData: parseCharacterAttributeData(input.attributeData),
        },
      },
      // Cache is updated directly above. Avoid unnecessary cache write, which
      // could cause UI flicker
      fetchPolicy: 'no-cache',
      refetchQueries: refetch ? [{ query: character, variables: { id: input.id } }] : undefined,
      awaitRefetchQueries: true,
    });

    return 'success';
  };

  return {
    updateCharacter,
    loading,
    error,
  };
};
