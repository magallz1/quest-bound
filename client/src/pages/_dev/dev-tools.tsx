import { Drawer, IconButton, Stack, Switch } from '@/libs/compass-core-ui';
import { Build } from '@mui/icons-material';
import { useState } from 'react';

export const DevTools = () => {
  const ItemSwitch = ({ label, item }: { label: string; item: string }) => {
    const [stored, setItem] = useState<boolean>(localStorage.getItem(item) === 'true');
    const handleSetItem = (item: string, on: boolean) => {
      localStorage.setItem(item, on.toString());
      setItem(on);
    };
    return (
      <Switch
        label={label}
        checked={stored}
        onChange={(_, checked) => handleSetItem(item, checked)}
      />
    );
  };

  const [devToolsOn, setToolsOn] = useState<boolean>(localStorage.getItem('dev.tools') === 'true');

  if (localStorage.getItem('dev.tools') === 'true') {
    return (
      <IconButton
        sx={{ position: 'fixed', bottom: 80, left: 2, bgcolor: 'primary.main' }}
        onClick={() => setToolsOn(true)}>
        <Build />
      </IconButton>
    );
  }
  return (
    <Drawer open={devToolsOn} onClose={() => setToolsOn(false)} anchor='bottom'>
      <Stack direction='row' spacing={4}>
        <Stack sx={{ height: '25vh', overflow: 'auto' }} padding={1}>
          <ItemSwitch label='Fail all GQL' item='dev.gql.fail' />
        </Stack>

        <Stack sx={{ height: '25vh', overflow: 'auto' }} padding={1}>
          <ItemSwitch label='Dev Server' item='dev.server' />
          <ItemSwitch label='Mock Users' item='dev.server.users' />
          <ItemSwitch label='Mock Sheets' item='dev.server.sheets' />
          <ItemSwitch label='Mock Chat' item='dev.server.chat' />
          <ItemSwitch label='Mock Images' item='dev.server.images' />
        </Stack>

        <Stack sx={{ height: '25vh', overflow: 'auto' }} padding={1}>
          <ItemSwitch label='Show component coords' item='dev.components.coords' />
        </Stack>
      </Stack>
    </Drawer>
  );
};
