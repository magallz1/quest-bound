import { Stack, Text } from '@/libs/compass-core-ui';
import { Person } from '@mui/icons-material';
import { ReactNode } from 'react';

export type SettingsRoute = {
  label: string;
  page: string;
  icon: ReactNode;
};

const settingsRoutes: SettingsRoute[] = [
  {
    label: 'Profile',
    page: 'profile',
    icon: <Person fontSize='small' />,
  },
];

interface SettingsNavProps {
  page: string;
  setPage: (page: string) => void;
}

export const SettingsNav = ({ page, setPage }: SettingsNavProps) => {
  return (
    <Stack spacing={1} padding={1}>
      {settingsRoutes.map((r) => (
        <Stack
          key={r.page}
          direction='row'
          spacing={2}
          width='100%'
          className='clickable'
          sx={{ color: page === r.page ? 'secondary.main' : 'inherit' }}
          onClick={() => setPage(r.page)}>
          {r.icon}
          <Text
            sx={{
              fontSize: '0.9rem',
              color: page === r.page ? 'secondary.main' : 'inherit',
            }}>
            {r.label}
          </Text>
        </Stack>
      ))}
    </Stack>
  );
};
