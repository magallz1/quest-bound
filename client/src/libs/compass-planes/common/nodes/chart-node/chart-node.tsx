import { ChartComponentData, useChart } from '@/libs/compass-api';
import { Loader } from '@/libs/compass-core-ui';
import { Box } from '@chakra-ui/react';
import { useNodeId } from 'reactflow';
import ResizableNodeWrapper from '../../components/resizable-node-wrapper';
import { useEditorStore } from '../../editor-store';
import { useNodeSize, useSubscribeComponentChanges } from '../../hooks';
import { getBorderStyles } from '../../utils';
import { ChartData } from './chart-data';

const defaultChartData = [
  ['Level', 'Bonus', 'Attack', 'Defense'],
  ['1', '+2', '1d6', '1d6'],
  ['2', '+2', '1d6', '1d8'],
  ['3', '+3', '1d8', '1d8'],
  ['4', '+3', '2d6', '2d6'],
  ['5', '+4', '2d6', '2d8'],
  ['6', '+5', '2d8', '2d8'],
];

const defaultChartStyles: Partial<ChartComponentData> = {
  headerBgColor: 'grey',
  evenRowBgColor: 'darkgrey',
  oddRowBgColor: 'lightgrey',
};

export const ChartNode = () => {
  const getComponent = useEditorStore((state) => state.getComponent);

  const id = useNodeId();

  const component = getComponent(id);

  const key = useSubscribeComponentChanges(id);

  const { height, width } = useNodeSize(component?.id);
  const css = JSON.parse(component?.style ?? '{}');
  const data = JSON.parse(component?.data ?? '{}') as ChartComponentData;
  const { chartId } = data;
  const { chart, loading } = useChart(chartId);

  if (!component) return null;

  const chartData = chart?.data ?? [];

  const renderedData = chartId ? chartData : defaultChartData;
  const renderedStyle = chartId ? data : defaultChartStyles;

  return (
    <ResizableNodeWrapper component={component} key={key}>
      <Box
        sx={{
          height,
          width,
          ...css,
          overflow: 'hidden',
          fontStyle: !chartId ? 'italic' : css.fontStyle,
          ...getBorderStyles(css),
        }}>
        {loading ? (
          <Loader />
        ) : (
          <ChartData chartData={renderedData} styles={renderedStyle} defaultChart={!chartId} />
        )}
      </Box>
    </ResizableNodeWrapper>
  );
};
