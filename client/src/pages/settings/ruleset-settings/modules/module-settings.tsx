import { Divider } from '@/libs/compass-core-ui';
import { Input, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { ModuleTable } from './module-table';

export const ModuleSettings = () => {
  const [filterValue, setFilterValue] = useState<string>('');

  return (
    <>
      <Stack spacing={4} id='publish-entity-page' sx={{ flexGrow: 1 }}>
        <Stack spacing={1}>
          <Text sx={{ opacity: 0.7 }}>Ruleset Modules</Text>
          <Divider />
        </Stack>
        <Input
          placeholder='Filter by title or creator'
          sx={{ width: 250 }}
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />

        <ModuleTable filterValue={filterValue} />
      </Stack>
    </>
  );
};
