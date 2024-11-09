import { Chart, ChartComponentData, SheetComponent } from '@/libs/compass-api';
import { ChartLookup, IconColorPicker } from '@/libs/compass-core-composites';
import { FontSelect, IconButton, Stack, Text, Tooltip } from '@/libs/compass-core-ui';
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react';
import { FormatPaint, ListAlt } from '@mui/icons-material';
import { CSSProperties } from 'react';
import { useParams } from 'react-router-dom';
import { useEditorStore } from '../../../editor-store';
import { FontSize } from './common-actions';

export const ChartEdit = ({
  component,
  disabled,
}: {
  component: SheetComponent;
  disabled?: boolean;
}) => {
  const { sheetId, updateComponent } = useEditorStore();

  const { rulesetId: rulesetIdParam } = useParams();
  const componentData = JSON.parse(component.data) as ChartComponentData;
  const { rulesetId: componentRulesetId } = componentData;

  const rulesetId = componentRulesetId || rulesetIdParam;

  const css = JSON.parse(component.style);

  const assignChart = (chart: Chart | null) => {
    if (!chart) return;
    updateComponent({
      sheetId,
      update: {
        id: component.id,
        data: JSON.stringify({ ...componentData, chartId: chart.id, rulsetId: chart.rulesetId }),
      },
    });
  };

  const updateChartStyles = (styles: Partial<ChartComponentData>) => {
    updateComponent({
      sheetId,
      update: {
        id: component.id,
        data: JSON.stringify({ ...componentData, ...styles }),
      },
    });
  };

  const updateStyles = (styles: CSSProperties) => {
    updateComponent({
      sheetId,
      update: {
        id: component.id,
        style: JSON.stringify({
          ...css,
          ...styles,
        }),
      },
    });
  };

  return (
    <>
      <FontSelect
        selected={css.fontFamily}
        onChange={(fontFamily) => updateStyles({ fontFamily })}
      />

      <FontSize
        value={css.fontSize}
        onChange={(update) =>
          updateStyles({ fontSize: JSON.parse(update.style ?? '{}')?.fontSize })
        }
      />

      <Popover>
        <PopoverTrigger>
          <Tooltip title='Select Chart' placement='bottom'>
            <IconButton disabled={disabled}>
              <ListAlt fontSize='small' />
            </IconButton>
          </Tooltip>
        </PopoverTrigger>
        <PopoverContent>
          <Stack padding={2} spacing={1}>
            <Text>Select a Chart</Text>
            <ChartLookup
              chartId={componentData.chartId}
              rulesetId={rulesetId}
              onSelect={assignChart}
            />
          </Stack>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger>
          <Tooltip title='Chart Style' placement='bottom'>
            <IconButton disabled={disabled}>
              <FormatPaint fontSize='small' />
            </IconButton>
          </Tooltip>
        </PopoverTrigger>
        <PopoverContent sx={{ width: '450px' }}>
          <Stack spacing={2} minWidth={400} padding={2}>
            <Stack direction='row' justifyContent='space-between' alignItems='center' width='100%'>
              <Stack spacing={4}>
                <Stack spacing={2} direction='row' alignItems='center'>
                  <Text variant='subtitle2'>Outlines</Text>
                  <IconColorPicker
                    tooltipPlacement='top'
                    disabled={disabled}
                    useAlpha
                    type='draw'
                    color={componentData.tableOutlineColor ?? ''}
                    onChange={(tableOutlineColor) => updateChartStyles({ tableOutlineColor })}
                  />
                </Stack>

                <Stack spacing={2} direction='row' alignItems='center'>
                  <Text variant='subtitle2'>Header Background</Text>
                  <IconColorPicker
                    tooltipPlacement='top'
                    disabled={disabled}
                    useAlpha
                    type='draw'
                    color={componentData.headerBgColor ?? ''}
                    onChange={(headerBgColor) => updateChartStyles({ headerBgColor })}
                  />
                </Stack>
              </Stack>

              <Stack spacing={4}>
                <Stack spacing={2} direction='row' alignItems='center'>
                  <Text variant='subtitle2'>Even Rows Background</Text>
                  <IconColorPicker
                    tooltipPlacement='top'
                    disabled={disabled}
                    useAlpha
                    type='draw'
                    color={componentData.evenRowBgColor ?? ''}
                    onChange={(evenRowBgColor) => updateChartStyles({ evenRowBgColor })}
                  />
                </Stack>

                <Stack spacing={2} direction='row' alignItems='center'>
                  <Text variant='subtitle2'>Odd Rows Background</Text>
                  <IconColorPicker
                    tooltipPlacement='top'
                    disabled={disabled}
                    useAlpha
                    type='draw'
                    color={componentData.oddRowBgColor ?? ''}
                    onChange={(oddRowBgColor) => updateChartStyles({ oddRowBgColor })}
                  />
                </Stack>
              </Stack>
            </Stack>

            <Stack direction='row' alignItems='center' justifyContent='space-between' width='100%'>
              <Text variant='subtitle2'>Vertical Spacing</Text>
              <NumberInput
                sx={{ width: 70 }}
                value={componentData.rowVerticalSpacing ?? 0}
                onChange={(value) => updateChartStyles({ rowVerticalSpacing: value })}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Stack>

            <Stack direction='row' alignItems='center' justifyContent='space-between' width='100%'>
              <Text variant='subtitle2'>Horizontal Spacing</Text>
              <NumberInput
                sx={{ width: 70 }}
                value={componentData.rowHorizontalSpacing ?? 0}
                onChange={(value) => updateChartStyles({ rowHorizontalSpacing: value })}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Stack>
          </Stack>
        </PopoverContent>
      </Popover>
    </>
  );
};
