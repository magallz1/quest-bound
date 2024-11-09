import { useQuickCreate } from '@/hooks';
import { useSheetTemplates } from '@/libs/compass-api';
import { EntityCardSlider } from '@/libs/compass-core-composites';
import { Button, Stack, Text } from '@chakra-ui/react';
import { Add } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

export const TemplatesEntityPage = () => {
  const { rulesetId } = useParams();
  const { setQuickCreatePage } = useQuickCreate();

  const navigate = useNavigate();
  const { sheets: sheetTemplates, loading } = useSheetTemplates();

  return (
    <Stack spacing={4}>
      <Stack direction='row' spacing={2}>
        <Button
          isDisabled={loading}
          rightIcon={<Add fontSize='small' />}
          onClick={() => setQuickCreatePage('template')}>
          Create Sheet Template
        </Button>
      </Stack>

      <Stack spacing={2}>
        <EntityCardSlider
          emptyState={
            <Text fontStyle='italic' variant='subtitle2'>
              No sheet templates found
            </Text>
          }
          entities={sheetTemplates}
          loading={loading}
          onClick={(entity) => navigate(`/rulesets/${rulesetId}/sheet-templates/${entity.id}/edit`)}
        />
      </Stack>
    </Stack>
  );
};
