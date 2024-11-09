import { Chart, useChart } from '@/libs/compass-api';
import { ChartLookup } from '@/libs/compass-core-composites';
import { Select, Skeleton, Stack, Text, Tooltip } from '@chakra-ui/react';
import { Height } from '@mui/icons-material';
import { useContext, useEffect } from 'react';
import { useNodeId } from 'reactflow';
import { NodeWrapper } from '../components';
import { LogicContext } from '../provider';

export const ChartNode = () => {
  const { getOperation, updateOperation } = useContext(LogicContext);
  const operation = getOperation(useNodeId() ?? '');
  if (!operation) return null;

  const chartId = operation.chartRef;
  const { chart, loading } = useChart(chartId ?? '');

  const columns: string[] = chart?.data ? chart.data[0] : [];
  const filterColumnName = !chart ? '' : operation.chartFilterColumnName ?? '';
  const valueColumnName = !chart ? '' : operation.chartValueColumnName ?? '';

  const link = chart ? `/rulesets/${chart.rulesetId}/charts?chartId=${chart.id}` : '';

  const onSelect = (chart: Chart | null) => {
    updateOperation({
      id: operation.id,
      chartRef: chart?.id ?? null,
    });
  };

  const onChange = (key: 'chartFilterColumnName' | 'chartValueColumnName', value: string) => {
    updateOperation({
      id: operation.id,
      [key]: value,
    });
  };

  const flipOrder = () => {
    updateOperation({
      id: operation.id,
      data: {
        ...operation.data,
        reverse: operation.data?.reverse ? false : true,
      },
    });
  };

  useEffect(() => {
    if (operation.chartRef && chart && !operation.chartValueColumnName) {
      onChange('chartValueColumnName', columns[0]);
    } else if (operation.chartRef && chart && !operation.chartFilterColumnName) {
      onChange('chartFilterColumnName', columns[0]);
    }
  }, [operation, chart]);

  return (
    <NodeWrapper data={operation} style={{ width: 350 }} link={link}>
      <Skeleton isLoaded={!loading}>
        <Stack spacing={2} padding={2}>
          <ChartLookup className='nodrag' chartId={chart?.id} onSelect={onSelect} />

          <Stack spacing={1}>
            <Text size='s'>Select from</Text>

            <Select
              size='m'
              value={filterColumnName}
              onChange={(e) => onChange('chartFilterColumnName', e.target.value)}>
              {columns.map((col, i) => (
                <option key={i} value={col}>
                  {col}
                </option>
              ))}
            </Select>
          </Stack>

          <Stack spacing={1}>
            <Text size='s'>Where value in</Text>

            <Select
              size='m'
              value={valueColumnName}
              onChange={(e) => onChange('chartValueColumnName', e.target.value)}>
              {columns.map((col, i) => (
                <option key={i} value={col}>
                  {col}
                </option>
              ))}
            </Select>
          </Stack>

          <Tooltip label='Reverse order of chart rows' placement='right'>
            <Height
              fontSize='small'
              sx={{
                color: operation.data?.reverse ? '#E66A3C' : 'inherit',
                position: 'absolute',
                bottom: 40,
                right: 5,
              }}
              role='button'
              onClick={flipOrder}
            />
          </Tooltip>
        </Stack>
      </Skeleton>
    </NodeWrapper>
  );
};
