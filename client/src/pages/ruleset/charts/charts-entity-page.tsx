import { useQuickCreate } from '@/hooks';
import { Chart, useChart, useDeleteChart, useUpdateChart } from '@/libs/compass-api';
import { ChartLookup } from '@/libs/compass-core-composites';
import { DeleteButton } from '@/libs/compass-core-ui';
import { Button, Editable, EditableInput, EditablePreview, Stack, Text } from '@chakra-ui/react';
import { Add } from '@mui/icons-material';
import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { EditActions } from './edit-actions';
import { RenderChart } from './render-chart';

export const ChartsEntityPage = () => {
  const { rulesetId } = useParams();
  const { setQuickCreatePage } = useQuickCreate();

  const [searchParams, setSearchParams] = useSearchParams();

  const { deleteChart, loading: deleteLoading } = useDeleteChart();
  const { updateChart, loading: updateLoading } = useUpdateChart();

  const [selectedChartId, setSelectedChartId] = useState<string>(searchParams.get('chartId') ?? '');
  const { chart } = useChart(selectedChartId);

  const handleSelect = (chart: Chart | null) => {
    if (chart) {
      setSelectedChartId(chart.id);
      setSearchParams({ chartId: chart.id });
    } else {
      setSelectedChartId('');
      setSearchParams();
    }
  };

  const updateTitle = async (title: string) => {
    if (!chart) return;
    await updateChart({
      id: chart.id,
      title,
    });
  };

  const handleDelete = async () => {
    if (!chart) return;
    await deleteChart(chart);
    setSelectedChartId('');
    setSearchParams({ chartId: '' });
  };

  return (
    <>
      <Stack id='charts-entity-page' sx={{ flexGrow: 1 }}>
        <Stack direction='row' spacing={2}>
          <Button onClick={() => setQuickCreatePage('chart')} rightIcon={<Add fontSize='small' />}>
            Create Chart
          </Button>

          <ChartLookup rulesetId={rulesetId ?? ''} onSelect={handleSelect} />
        </Stack>

        <Stack spacing={2} sx={{ flexGrow: 1 }}>
          <Stack
            direction='row'
            width='100%'
            justifyContent='space-between'
            alignItems='center'
            pl={2}
            pr={2}>
            <Stack direction='row' spacing={4} align='center'>
              {chart ? (
                <Editable
                  key={chart.id}
                  onSubmit={(val) => updateTitle(val)}
                  fontSize='1.5rem'
                  defaultValue={chart.title}>
                  <EditablePreview />
                  <EditableInput />
                </Editable>
              ) : (
                <Text variant={chart ? 'h5' : 'body1'} fontStyle={chart ? 'inherit' : 'italic'}>
                  Select a chart from the dropdown
                </Text>
              )}
            </Stack>
            {!!chart && (
              <Stack direction='row'>
                <EditActions chart={chart} />
                <DeleteButton
                  loading={deleteLoading}
                  title={`Delete ${chart.title}`}
                  onDelete={handleDelete}
                />
              </Stack>
            )}
          </Stack>

          <RenderChart
            style={{
              height: 'calc(100vh - 250px)',
              width: 'calc(100vw - 280px)',
            }}
          />
        </Stack>
      </Stack>
    </>
  );
};
