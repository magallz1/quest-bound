import { Stack, Text } from '@/libs/compass-core-ui';
import { PersonOutline } from '@mui/icons-material';
import { SettingsRoute } from '../settings-nav';

const settingsRoutes: SettingsRoute[] = [
  {
    label: 'Character Details',
    page: 'character-details',
    icon: <PersonOutline fontSize='small' />,
  },
];

interface Props {
  page: string;
  setPage: (page: string) => void;
}

export const CharacterSettingsNav = ({ page, setPage }: Props) => {
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
