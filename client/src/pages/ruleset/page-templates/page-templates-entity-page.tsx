import { useQuickCreate } from '@/hooks';
import { usePageTemplates } from '@/libs/compass-api';
import { EntityCardSlider } from '@/libs/compass-core-composites';
import { Button, Stack, Text } from '@chakra-ui/react';
import { Add } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

export const PageTemplatesEntityPage = () => {
  const { rulesetId } = useParams();
  const { setQuickCreatePage } = useQuickCreate();
  const navigate = useNavigate();

  const { pages: pageTemplates, loading } = usePageTemplates();

  return (
    <Stack spacing={4}>
      <Stack direction='row' spacing={2}>
        <Button
          onClick={() => setQuickCreatePage('page-template')}
          isDisabled={loading}
          rightIcon={<Add fontSize='small' />}>
          Create Page Template
        </Button>
      </Stack>

      <Stack spacing={2}>
        <EntityCardSlider
          emptyState={
            <Text fontStyle='italic' variant='subtitle2'>
              No page templates found
            </Text>
          }
          entities={pageTemplates}
          loading={loading}
          onClick={(entity) => navigate(`/rulesets/${rulesetId}/page-templates/${entity.id}`)}
        />
      </Stack>
    </Stack>
  );
};
