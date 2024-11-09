import { Character, characters as charactersQuery, CharactersQuery, SheetType } from '../../gql';
import { useLazyQuery, useQuery } from '../../utils';
import { useError } from '../metrics';

export const useCharacters = () => {
  const { data, loading, error } = useQuery<CharactersQuery>(charactersQuery);

  useError({
    error,
    message: 'Failed to fetch characters',
    location: 'useCharacters',
  });

  const [query, { error: lazyError, loading: lazyLoading }] =
    useLazyQuery<CharactersQuery>(charactersQuery);

  useError({
    error: lazyError,
    message: 'Failed to fetch characters',
    location: 'useCharacters',
  });

  const getCharacters = async () => {
    const res = await query();

    if (!res.data?.characters) {
      throw Error('Failed to fetch characters');
    }

    return res.data.characters as Character[];
  };

  const characters = (data?.characters ?? []) as Character[];

  // For sheet templates, a character is created in cache to hold preview data.
  const nonTemplateCharacters = characters.filter(
    (character) => character.sheet?.type !== SheetType.TEMPLATE,
  );

  return {
    getCharacters,
    characters: nonTemplateCharacters,
    error: error || lazyError,
    loading: loading || lazyLoading,
  };
};
