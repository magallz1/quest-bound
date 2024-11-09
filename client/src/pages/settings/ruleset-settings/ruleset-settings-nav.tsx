import { Stack, Text } from '@/libs/compass-core-ui';
import { AutoStories, Extension } from '@mui/icons-material';
import { SettingsRoute } from '../settings-nav';

const routes: SettingsRoute[] = [
  {
    label: 'Ruleset Settings',
    page: 'ruleset-settings',
    icon: <AutoStories fontSize='small' />,
  },
  {
    label: 'Modules',
    page: 'ruleset-modules',
    icon: <Extension fontSize='small' />,
  },
];

interface Props {
  page: string;
  setPage: (page: string) => void;
}

export const RulesetSettingsNav = ({ page, setPage }: Props) => {
  return (
    <Stack spacing={1} padding={1}>
      {routes.map((r) => (
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
