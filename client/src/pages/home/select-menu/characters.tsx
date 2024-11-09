import { Character, useCharacters } from '@/libs/compass-api';
import { Loading } from '@/libs/compass-core-ui';
import { Button, Input, InputGroup, InputLeftAddon, Select, Stack, Text } from '@chakra-ui/react';
import { Search } from '@mui/icons-material';
import { useState } from 'react';
import { SelectionCard } from './components';
import { CreateCharacter } from './components/create-character';

interface Props {
  selection: Character | null;
  onSelect: (selection: Character | null) => void;
}

export const Characters = ({ selection, onSelect }: Props) => {
  const { characters, loading } = useCharacters();
  const [rulesetFilter, setRulesetFilter] = useState<string>('All');
  const [creatingCharacter, setCreatingCharacter] = useState(false);

  const rulesetTitles = new Set(characters.map((character) => character.rulesetTitle));

  const [searchFilter, setSearchFilter] = useState<string>('');

  const filteredCharacters = characters
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter((character) => {
      if (rulesetFilter === 'All') {
        return true;
      }
      return character.rulesetTitle === rulesetFilter;
    });

  const filteredBySearch = filteredCharacters.filter((character) => {
    if (searchFilter === '') {
      return true;
    }
    return character.name.toLowerCase().includes(searchFilter.toLowerCase());
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Stack spacing={8}>
        <Button sx={{ width: 200 }} onClick={() => setCreatingCharacter(true)}>
          Create
        </Button>
        <Stack direction='row' sx={{ width: '100%', flexWrap: 'wrap' }}>
          <InputGroup width='200px'>
            <InputLeftAddon>
              <Search />
            </InputLeftAddon>
            <Input
              placeholder='Search'
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </InputGroup>
          <Select onChange={(e) => setRulesetFilter(e.target.value)} width='200px'>
            <option value='All'>All</option>
            {[...rulesetTitles].map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </Select>
        </Stack>
        {filteredBySearch.length === 0 && (
          <Text fontStyle='italic'>
            Create a character from a ruleset on your shelf or one of your custom rulesets
          </Text>
        )}
        <Stack direction='row' flexWrap='wrap' spacing={4} padding={2} overflowY='auto'>
          {filteredBySearch.map((character, i) => (
            <SelectionCard
              index={i}
              onClick={() =>
                character.id === selection?.id ? onSelect(null) : onSelect(character)
              }
              key={character.id}
              title={character.name}
              img={character.image?.src}
              byLine={character.rulesetTitle}
              selected={character.id === selection?.id}
            />
          ))}
        </Stack>
      </Stack>
      <CreateCharacter isOpen={creatingCharacter} onClose={() => setCreatingCharacter(false)} />
    </>
  );
};
