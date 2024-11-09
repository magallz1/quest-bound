import { BoxComponentData, SheetComponent, UpdateSheetComponent } from '@/libs/compass-api';
import { IconButton, Stack, Tooltip } from '@/libs/compass-core-ui';
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import { Hexagon } from '@mui/icons-material';
import { PlaneEditorType } from '../../../../types';
import { useEditorStore } from '../../../editor-store';
import { getInitialValues } from '../../../utils';
import { AssignAction } from './assign-action';
import { AssignLink } from './assign-link';

export const BoxEdit = ({
  components,
  disabled,
}: {
  components: SheetComponent[];
  disabled?: boolean;
}) => {
  const { sheetId, updateComponents, editorType } = useEditorStore();

  const initialValues = getInitialValues(components);
  const data = JSON.parse(initialValues.data) as BoxComponentData;

  const handleUpdate = (update: Partial<UpdateSheetComponent>) => {
    updateComponents({
      sheetId,
      updates: components
        .filter((c) => !c.locked)
        .map((comp) => {
          const data = JSON.parse(comp.data) as BoxComponentData;
          return {
            id: comp.id,
            data: JSON.stringify({
              ...data,
              ...JSON.parse(update.data ?? '{}'),
            }),
          };
        }),
    });
  };

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Tooltip title={'Polygon'}>
            <IconButton disabled={disabled}>
              <Hexagon />
            </IconButton>
          </Tooltip>
        </PopoverTrigger>
        <PopoverContent style={{ width: 100 }}>
          <Stack padding={2} spacing={1}>
            <Text>Sides</Text>
            <NumberInput
              value={data.sides}
              min={3}
              onChange={(value) => {
                handleUpdate({
                  data: JSON.stringify({ sides: parseInt(value) }),
                });
              }}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Stack>
        </PopoverContent>
      </Popover>

      {editorType === PlaneEditorType.SHEET && <AssignAction data={data} onChange={handleUpdate} />}

      {editorType !== PlaneEditorType.MANAGE && (
        <AssignLink onChange={handleUpdate} data={data} disabled={disabled} />
      )}
    </>
  );
};
