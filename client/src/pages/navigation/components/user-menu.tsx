import { HelpButton } from '@/components/help-button';
import { JoinDiscord, useCurrentUser, useSessionToken, useSignOut } from '@/libs/compass-api';
import { Avatar, UserDetails } from '@/libs/compass-core-ui';
import { SettingsContext } from '@/libs/compass-web-utils';
import { Container, Popover, PopoverContent, PopoverTrigger, Stack, Text } from '@chakra-ui/react';
import { FileDownload, Logout, Settings } from '@mui/icons-material';
import axios from 'axios';
import { useContext } from 'react';

export const UserMenu = () => {
  const { currentUser } = useCurrentUser();
  const { openSettingsModal } = useContext(SettingsContext);
  const { signOut } = useSignOut();
  const { token } = useSessionToken();

  const exportData = async () => {
    const res = await axios.post(
      'http://localhost:8000/export',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const blob = new Blob([JSON.stringify(res.data)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'qb-data.json';
    link.click();
  };

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <div role='button'>
            <Avatar alt='Profile' variant='rounded' src={currentUser?.avatarSrc || undefined}>
              {currentUser?.username?.charAt(0)}
            </Avatar>
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <Stack padding={2} spacing={4}>
            <UserDetails
              avatarSrc={currentUser?.avatarSrc}
              email={currentUser?.email}
              username={currentUser?.username}
            />
            <Container
              role='button'
              onClick={() => {
                openSettingsModal(true);
              }}>
              <Stack width='100%' direction='row' spacing={4} alignItems='center'>
                <Settings fontSize='small' />
                <Text>Settings</Text>
              </Stack>
            </Container>
            <Container role='button'>
              <JoinDiscord
                size='small'
                align='start'
                label={<Text sx={{ ml: '8px' }}>Discord</Text>}
                style={{ paddingLeft: '4px' }}
              />
            </Container>
            <Container role='button'>
              <HelpButton />
            </Container>
            <Container role='button' onClick={exportData}>
              <Stack width='100%' direction='row' spacing={4} alignItems='center'>
                <FileDownload fontSize='small' />
                <Text>Export Data</Text>
              </Stack>
            </Container>
            <Container onClick={signOut} role='button'>
              <Stack width='100%' direction='row' spacing={4} alignItems='center'>
                <Logout fontSize='small' />
                <Text>Sign Out</Text>
              </Stack>
            </Container>
          </Stack>
        </PopoverContent>
      </Popover>
    </>
  );
};
