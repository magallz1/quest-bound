import {
  BoxComponentData,
  ComponentTypes,
  SheetComponent,
  UpdateSheetComponent,
} from '@/libs/compass-api';
import { IconButton, Tooltip } from '@/libs/compass-core-ui';
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
import { Opacity } from '@mui/icons-material';
import { useEditorStore } from '../../../editor-store';
import { allEditableValues, getInitialValues } from '../../../utils';
import { IconColorPicker } from '../edit-components/icon-color-picker';
import { BorderEdit } from './border-edit';
import { RotateEdit } from './rotate-edit';

interface CssEditProps {
  components: SheetComponent[];
  disabled?: boolean;
}

export const CssEdit = ({ components, disabled = false }: CssEditProps) => {
  const { sheetId, updateComponents } = useEditorStore();

  const selectedTypes = new Set<ComponentTypes>();

  for (const component of components) {
    selectedTypes.add(component.type as ComponentTypes);
  }

  const polygon =
    components
      .filter((comp) => comp.type === ComponentTypes.SHAPE)
      .filter((shape) => {
        const data = JSON.parse(shape.data) as BoxComponentData;
        return data.sides !== 4;
      }).length > 0;

  const initialValues = getInitialValues(components);
  const allCommonValues = allEditableValues([...selectedTypes]);

  const allCommonStyles = JSON.parse(initialValues.style);

  const handleUpdate = (update: Partial<UpdateSheetComponent>) => {
    updateComponents({
      sheetId,
      updates: components.map((comp) => ({
        id: comp.id,
        style: JSON.stringify({
          ...JSON.parse(comp.style),
          ...JSON.parse(update.style ?? '{}'),
        }),
      })),
    });
  };

  return (
    <>
      {allCommonValues.includes('color') && (
        <IconColorPicker
          disabled={disabled}
          useAlpha
          type='font'
          color={allCommonStyles.color}
          stroke='white'
          onChange={(color) => handleUpdate({ style: JSON.stringify({ color }) })}
        />
      )}
      {allCommonValues.includes('backgroundColor') && (
        <IconColorPicker
          disabled={disabled}
          useAlpha
          type='background'
          color={allCommonStyles.backgroundColor}
          stroke='white'
          onChange={(backgroundColor) =>
            handleUpdate({ style: JSON.stringify({ backgroundColor }) })
          }
        />
      )}

      {allCommonValues.includes('opacity') && (
        <Popover>
          <PopoverTrigger>
            <Tooltip title={disabled ? '' : 'Opacity'}>
              <IconButton aria-label='Opacity' disabled={disabled}>
                <Opacity fontSize='small' />
              </IconButton>
            </Tooltip>
          </PopoverTrigger>
          <PopoverContent style={{ width: 100 }}>
            <Stack sx={{ overflow: 'hidden' }} padding={2} justifyContent='space-between'>
              <Text variant='subtitle2'>{'Opacity'}</Text>
              <NumberInput
                sx={{ width: 70 }}
                value={allCommonStyles.opacity}
                min={0}
                max={1}
                step={0.1}
                onChange={(val) =>
                  handleUpdate({
                    style: JSON.stringify({ opacity: val }),
                  })
                }>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Stack>
          </PopoverContent>
        </Popover>
      )}

      {allCommonValues.includes('borderRadius') && (
        <BorderEdit
          disabled={disabled}
          allCommonStyles={allCommonStyles}
          onChange={handleUpdate}
          polygon={polygon}
        />
      )}

      <RotateEdit components={components} disabled={disabled} />
    </>
  );
};
