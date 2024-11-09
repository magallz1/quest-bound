import { Link, Stack, Text } from '@/libs/compass-core-ui';
import { HelpCenter } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';

export const HelpButton = () => {
  const { pathname, search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const selected = queryParams.get('selected');

  const domain = 'https://docs.questbound.com/docs';

  const getHref = () => {
    let path = '';

    if (pathname.includes('rulebook/edit')) {
      path = 'rulebook';
    } else if (/attributes\/[\w]+/.test(pathname)) {
      path = 'logic';
    } else if (pathname.includes('attributes')) {
      path = 'attributes';
    } else if (pathname.includes('characters')) {
      path = 'characters';
    } else if (pathname.includes('charts')) {
      path = 'charts';
    } else if (pathname.includes('archetypes')) {
      path = 'archetypes';
    } else if (pathname.includes('documents')) {
      path = 'documents';
    } else if (pathname.includes('page-templates')) {
      path = 'rulebook#page-templates';
    } else if (pathname.includes('sheet-templates')) {
      path = 'sheet-templates';
    } else {
      path = 'intro';
    }

    return `${domain}/${path}`;
  };

  return (
    <Link
      href={getHref()}
      target='_blank'
      rel='noopener noreferrer'
      sx={{
        color: 'unset',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textDecoration: 'none',
        width: '100%',
      }}>
      <Stack direction='row' spacing={2} alignItems='center' width='100%'>
        <HelpCenter fontSize='small' />
        <Text>Help</Text>
      </Stack>
    </Link>
  );
};
