import { Ruleset, useRulesets } from '@/libs/compass-api';
import { Loading } from '@/libs/compass-core-ui';
import { Button, Input, InputGroup, InputLeftAddon, Select, Stack, Text } from '@chakra-ui/react';
import { Search } from '@mui/icons-material';
import { useState } from 'react';
import { CreateRuleset, SelectionCard } from './components';
import { useFilterContent } from './hooks';

interface Props {
  selection: Ruleset | null;
  onSelect: (selection: Ruleset | null) => void;
}

export const CustomRulesets = ({ selection, onSelect }: Props) => {
  const { rulesets, modules, loading } = useRulesets();
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [parentFilter, setParentFilter] = useState<string>('All');
  const [creatingRuleset, setCreatingRuleset] = useState(false);
  const [searchFilter, setSearchFilter] = useState<string>('');

  const moduleParents = new Set<string>(modules.map((module) => module.rulesetTitle ?? ''));
  const content = [...modules, ...rulesets];

  const isCollaborator = (id: string) => false;

  const filteredContent = useFilterContent({
    content,
    typeFilter,
    parentFilter,
    searchFilter,
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Stack spacing={8}>
        <Button sx={{ width: 200 }} onClick={() => setCreatingRuleset(true)}>
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
          <Select onChange={(e) => setTypeFilter(e.target.value)} width='200px'>
            <option value='All'>All</option>
            <option value='Rulesets'>Rulesets</option>
            <option value='Modules'>Modules</option>
          </Select>
          {typeFilter === 'Modules' && (
            <Select onChange={(e) => setParentFilter(e.target.value)} width='200px'>
              <option value='All'>All</option>
              <option value='Generic'>Generic</option>
              {[...moduleParents].map((parent) => (
                <option key={parent} value={parent}>
                  {parent}
                </option>
              ))}
            </Select>
          )}
        </Stack>
        {filteredContent.length === 0 &&
          (typeFilter === 'Modules' ? (
            <Text fontStyle='italic'>
              Create a module by selecting a custom ruleset or a ruleset on your shelf.
            </Text>
          ) : (
            <Text fontStyle='italic'>
              Create a ruleset or copy one from your shelf to customize it.
            </Text>
          ))}
        <Stack
          direction='row'
          flexWrap='wrap'
          spacing={4}
          padding={2}
          overflowY='auto'
          maxHeight='calc(100dvh - 60px)'>
          {filteredContent.map((ruleset, i) => (
            <SelectionCard
              index={i}
              onClick={() => (ruleset.id === selection?.id ? onSelect(null) : onSelect(ruleset))}
              key={ruleset.id}
              title={ruleset.title}
              img={ruleset.image?.src}
              selected={ruleset.id === selection?.id}
              published={ruleset.published}
              module={ruleset.isModule}
              copied={!!ruleset.publishedRulesetId}
              collaborator={isCollaborator(ruleset.id)}
            />
          ))}
        </Stack>
      </Stack>
      <CreateRuleset isOpen={creatingRuleset} onClose={() => setCreatingRuleset(false)} />
    </>
  );
};
