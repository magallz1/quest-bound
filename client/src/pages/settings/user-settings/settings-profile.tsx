import { UploadAvatar } from '@/components/upload-avatar';
import { SetUsernameInput, useSignOut } from '@/libs/compass-api';
import { Divider, useDeviceSize } from '@/libs/compass-core-ui';
import { SettingsContext } from '@/libs/compass-web-utils';
import { Button, Stack, Text } from '@chakra-ui/react';
import { useContext } from 'react';
import { NotificationSettings } from './settings-notifications';

export const SettingsProfile = () => {
  const { openSettingsModal } = useContext(SettingsContext);
  const { signOut } = useSignOut();

  const { mobile } = useDeviceSize();

  return (
    <Stack spacing={4} padding={2}>
      <Text sx={{ opacity: 0.7 }}>Profile</Text>
      <Divider />

      <Button
        sx={{ width: 100 }}
        onClick={() => {
          openSettingsModal(false);
          signOut();
        }}>
        Sign Out
      </Button>

      <Stack spacing={4}>
        <Stack spacing={4}>
          <SetUsernameInput style={{ width: 250 }} inputStyle={{ width: 250 }} />
          <UploadAvatar
            containerStyle={{ height: 150, width: 150 }}
            imageStyle={{ height: 150, width: 150 }}
          />
        </Stack>
        <NotificationSettings />
      </Stack>
    </Stack>
  );
};
