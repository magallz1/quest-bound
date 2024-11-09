import { useChart, useUpdateChart } from '@/libs/compass-api';
import { Grid } from '@/libs/compass-core-composites';
import { Loader, Progress, Stack, Text, useDeviceSize } from '@/libs/compass-core-ui';
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { buildRows, getHeaderRow } from './utils';

interface Props {
  style?: React.CSSProperties;
  readOnly?: boolean;
}

export const RenderChart = ({ readOnly = false }: Props) => {
  const [searchParams] = useSearchParams();

  const { chart, loading } = useChart(searchParams.get('chartId') ?? '');
  const { updateChart } = useUpdateChart();
  const chartData = chart?.data ?? [];

  const headerRowRaw = chartData.length ? chartData[0] : [];
  const headerRow = chartData.length
    ? [{ field: '_id', editable: false, hide: true }, ...getHeaderRow(headerRowRaw, !readOnly)]
    : [];

  const rows = buildRows(chartData, headerRowRaw);

  const onUpdate = (data: any) => {
    if (!chart) return;
    const updatedData = rows.map((row) => {
      if (row._id === data._id) {
        return data;
      }
      return row;
    });

    const updatedRawChartData: string[][] = [headerRowRaw];

    for (const update of updatedData) {
      const values: string[] = [];
      for (const key of headerRowRaw) {
        if (key !== '_id') {
          values.push(update[key]);
        }
      }

      updatedRawChartData.push(values);
    }

    updateChart(
      {
        id: chart.id,
      },
      updatedRawChartData,
    );
  };

  return (
    <Stack sx={{ height: '100%', width: '100%' }} spacing={1}>
      {loading && <Progress color='info' sx={{ width: '100%' }} />}
      <Grid colDefs={headerRow} rowData={rows} onCellValueChanged={onUpdate} />
    </Stack>
  );
};

export const CharacterViewChart = () => {
  const [searchParams] = useSearchParams();

  const { desktop } = useDeviceSize();
  const { chart, loading } = useChart(searchParams.get('chartId') ?? '');

  const widthBuffer = desktop ? 280 : 20;

  return (
    <Stack spacing={2} padding={1}>
      {loading ? (
        <Loader color='info' />
      ) : (
        <>
          <Text variant='h4' sx={{ pt: 1 }}>
            {chart?.title}
          </Text>
          <Stack
            sx={{
              height: 'calc(100vh - 180px)',
              width: `calc(100vw - ${widthBuffer}px)`,
            }}>
            <RenderChart readOnly />
          </Stack>
        </>
      )}
    </Stack>
  );
};
