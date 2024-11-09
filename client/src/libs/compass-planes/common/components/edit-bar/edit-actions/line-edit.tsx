import { ComponentTypes, LineComponentData, SheetComponent } from '@/libs/compass-api';
import { IconColorPicker } from '@/libs/compass-core-composites';
import { IconButton, Tooltip } from '@/libs/compass-core-ui';
import { generateId, useKeyListeners } from '@/libs/compass-web-utils';
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
} from '@chakra-ui/react';
import { HorizontalRule, Pentagon, Polyline, Timeline } from '@mui/icons-material';
import { useEditorStore } from '../../../editor-store';

export const LineEdit = ({ component }: { component: SheetComponent }) => {
  const { createComponents, setSelectedComponentIds } = useEditorStore();

  const selectComponents = (ids: string[]) => setSelectedComponentIds(ids);

  const {
    updateComponents,
    getSelectedComponentIds,
    components: activeComponents,
    sheetId,
  } = useEditorStore();
  const selectedComponents = activeComponents.filter((c) =>
    getSelectedComponentIds().includes(c.id),
  );

  // const { createComponent } = useCreateComponent();

  const data = JSON.parse(component.data) as LineComponentData;
  const singlePointSelected =
    selectedComponents.length === 1 && selectedComponents[0].id === component.id;

  const componentHasConnection = activeComponents
    .filter((c) => c.type === ComponentTypes.LINE)
    .some((line) => {
      const lineData = JSON.parse(line.data) as LineComponentData;
      return lineData.connectedId === component.id;
    });

  const allConnectedLineComponents = data.connectionId
    ? activeComponents
        .filter((c) => c.type === ComponentTypes.LINE)
        .filter((line) => {
          const lineData = JSON.parse(line.data) as LineComponentData;
          return data.connectionId === lineData.connectionId;
        })
    : [component];

  const handleUpdate = (data: Partial<LineComponentData>) => {
    updateComponents({
      sheetId,
      updates: allConnectedLineComponents.map((line) => ({
        id: line.id,
        data: JSON.stringify({
          ...JSON.parse(line.data),
          ...data,
        }),
      })),
    });
  };

  const handleCreateConnection = () => {
    const connectionId = data.connectionId ?? generateId();
    if (!data.connectedId) {
      handleUpdate({
        connectionId,
      });
    }

    createComponents({
      clone: false,
      components: [
        {
          ...component,
          sheetId,
          x: Math.min(1000, component.x + 40),
          id: generateId(),
          data: JSON.stringify({
            ...data,
            connectedId: component.id,
            connectionId,
            index: data.index + 1,
          }),
        },
      ],
      onCreate: (newComponents) => {
        selectComponents(newComponents.map((c) => c.id));
      },
    });
  };

  const selectAllConnected = () => {
    selectComponents(allConnectedLineComponents.map((c) => c.id));
  };

  useKeyListeners({
    disabled: !singlePointSelected,
    onKeyDown: (e) => {
      if (e.key === 'c' && !componentHasConnection) {
        handleCreateConnection();
      }
    },
  });

  return (
    <>
      <Tooltip title='Select All Connected'>
        <IconButton onClick={selectAllConnected} disabled={allConnectedLineComponents.length === 1}>
          <Polyline fontSize='small' />
        </IconButton>
      </Tooltip>

      <Popover>
        <PopoverTrigger>
          <Tooltip title='Line Width'>
            <IconButton>
              <HorizontalRule fontSize='small' />
            </IconButton>
          </Tooltip>
        </PopoverTrigger>
        <PopoverContent style={{ width: 100 }}>
          <Stack spacing={1} padding={2}>
            <Text variant='subtitle2'>Line Width</Text>
            <NumberInput
              sx={{ width: 70 }}
              value={data.strokeWidth}
              min={1}
              step={1}
              onChange={(_, val) => handleUpdate({ strokeWidth: val })}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Stack>
        </PopoverContent>
      </Popover>

      <Tooltip title='Create Connection'>
        <IconButton onClick={handleCreateConnection} disabled={componentHasConnection}>
          <Timeline fontSize='small' />
        </IconButton>
      </Tooltip>

      <Tooltip title='Fill Shape'>
        <IconButton
          onClick={() => handleUpdate({ fillShape: !data.fillShape })}
          disabled={!data.connectionId}>
          <Pentagon
            fontSize='small'
            sx={{ color: data.fillShape ? data.strokeColor : 'inherit' }}
          />
        </IconButton>
      </Tooltip>

      <IconColorPicker
        useAlpha
        type='background'
        color={data.strokeColor}
        onChange={(strokeColor) => handleUpdate({ strokeColor })}
      />
    </>
  );
};
