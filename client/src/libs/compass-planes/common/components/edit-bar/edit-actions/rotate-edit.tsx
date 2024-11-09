import { ComponentTypes, SheetComponent } from '@/libs/compass-api';
import { Tooltip as CoreTooltip } from '@/libs/compass-core-ui';
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
  Tooltip,
} from '@chakra-ui/react';
import { Rotate90DegreesCw, RotateLeft, RotateRight } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useEditorStore } from '../../../editor-store';

export const RotateEdit = ({
  components,
  disabled,
}: {
  components: SheetComponent[];
  disabled?: boolean;
}) => {
  const { sheetId, updateComponents } = useEditorStore();

  const applyRotation = (rotation: number) => {
    updateComponents({
      sheetId,
      updates: components.map((comp) => ({
        id: comp.id,
        rotation:
          comp.rotation + rotation >= 360 || comp.rotation + rotation <= -360
            ? 0
            : comp.rotation + rotation,
      })),
    });
  };

  const setRotation = (rotation: number) => {
    updateComponents({
      sheetId,
      updates: components.map((comp) => ({
        id: comp.id,
        rotation,
      })),
    });
  };

  const includesInventory = components.some((comp) => comp.type === ComponentTypes.INVENTORY);
  if (includesInventory) return null;

  return (
    <Popover>
      <PopoverTrigger>
        <CoreTooltip title='Rotate'>
          <IconButton aria-label='Rotate' disabled={disabled}>
            <Rotate90DegreesCw fontSize='small' />
          </IconButton>
        </CoreTooltip>
      </PopoverTrigger>
      <PopoverContent sx={{ width: '200px' }}>
        <Stack padding={2}>
          <Tooltip label='Rotate 90° Right' placement='right'>
            <IconButton aria-label='Rotate' disabled={disabled} onClick={() => applyRotation(90)}>
              <RotateRight fontSize='small' />
            </IconButton>
          </Tooltip>
          <Tooltip label='Rotate 90° Left' placement='right'>
            <IconButton aria-label='Rotate' disabled={disabled} onClick={() => applyRotation(-90)}>
              <RotateLeft fontSize='small' />
            </IconButton>
          </Tooltip>
          <NumberInput
            min={-359}
            max={359}
            value={components[0].rotation ?? 0}
            onChange={(value) => setRotation(parseInt(value))}>
            <NumberInputField disabled={disabled || components.length !== 1} />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Stack>
      </PopoverContent>
    </Popover>
  );
};
