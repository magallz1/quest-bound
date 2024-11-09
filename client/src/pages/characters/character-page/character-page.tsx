import { AttributeProvider, useCharacter } from '@/libs/compass-api';
import { Loading } from '@/libs/compass-core-ui';
import { useAttributeState } from '@/pages/ruleset/attributes/attribute-store';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CharacterSheet } from './character-sheet';
import { SimpleCharacterSheet } from './simple-character-sheet';

export const CharacterPage = () => {
  const { characterId } = useParams();
  const { character, error, loading } = useCharacter(characterId);

  const attributeState = useAttributeState(characterId);

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const selected = queryParams.get('selected');

  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      navigate('/');
    }
  }, [error]);

  if (loading) {
    return <Loading />;
  }

  return (
    <AttributeProvider value={attributeState}>
      {selected === 'simple-sheet' ? (
        <SimpleCharacterSheet />
      ) : (
        <CharacterSheet sheetId={character?.sheet?.id} loading={loading} />
      )}
    </AttributeProvider>
  );
};
