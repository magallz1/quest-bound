import {
  Character,
  Ruleset,
  useCurrentUser,
  useOfficialContent,
  usePermittedRulesets,
} from '@/libs/compass-api';
import { Loading } from '@/libs/compass-core-ui';
import { Input, InputGroup, InputLeftAddon, Select, Stack, Text } from '@chakra-ui/react';
import { Search } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { SelectionCard } from './components';
import { useFilterContent } from './hooks';

interface Props {
  onSelect: (selection: Ruleset | Character | null) => void;
  selection?: Ruleset | Character | null;
}

export const Shelf = ({ onSelect, selection }: Props) => {
  const {
    rulesets: officialRulesets,
    modules: officialModules,
    loading: officialLoading,
  } = useOfficialContent();

  const [pollingInterval, setPollingInterval] = useState<number>(5000);

  useEffect(() => {
    // Adds half a second to the poll at each interval up to 1 minute
    if (pollingInterval > 60000) return;
    const interval = setTimeout(() => {
      setPollingInterval((prev) => prev + 500);
    }, pollingInterval + 100);

    return () => clearTimeout(interval);
  }, [pollingInterval]);

  const officialContent = [...officialModules, ...officialRulesets] as Ruleset[];
  const { currentUser } = useCurrentUser(pollingInterval);
  const playerRulesets = currentUser?.playtestRulesets ?? [];
  const { permittedRulesets, loading: pLoading } = usePermittedRulesets(true, pollingInterval);

  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [parentFilter, setParentFilter] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const content = [...officialContent, ...permittedRulesets, ...playerRulesets] as Ruleset[];
  const modules = content.filter((ruleset) => ruleset.isModule);
  const moduleParents = new Set<string>(modules.map((module) => module.rulesetTitle ?? ''));

  const isPlayerRuleset = (id: string) => playerRulesets.some((r) => r.id === id);
  const isOfficial = (id: string) => officialContent.some((r) => r.id === id);

  const filteredContent = useFilterContent({
    content,
    typeFilter,
    parentFilter,
    searchFilter,
  });

  const loading = officialLoading || pLoading;

  if (loading) {
    return <Loading />;
  }

  return (
    <Stack spacing={8}>
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
      {content.length === 0 && <Text fontStyle='italic'>Content you own will appear here</Text>}
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
            byLine={ruleset.createdBy}
            selected={ruleset.id === selection?.id}
            player={isPlayerRuleset(ruleset.id)}
            official={isOfficial(ruleset.id)}
            published={ruleset.published && !isOfficial(ruleset.id)}
          />
        ))}
      </Stack>
    </Stack>
  );
};
