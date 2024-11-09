import { PdfComponentData, SheetComponent } from '@/libs/compass-api';
import { Stack, Text, ToggleButton, ToggleButtonGroup, Tooltip } from '@/libs/compass-core-ui';
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react';
import { FitScreen } from '@mui/icons-material';
import { useEditorStore } from '../../../editor-store';

export const PdfEdit = ({
  component,
  disabled,
}: {
  component: SheetComponent;
  disabled?: boolean;
}) => {
  const { sheetId, updateComponent } = useEditorStore();

  const data = JSON.parse(component.data) as PdfComponentData;

  const autoScale = data.autoScale ?? false;

  const assignPage = (pageNumber: number) => {
    updateComponent({
      sheetId,
      update: {
        id: component.id,
        data: JSON.stringify({ ...data, pageNumber }),
      },
    });
  };

  const assignAutoScale = (autoScale: boolean) => {
    updateComponent({
      sheetId,
      update: {
        id: component.id,
        data: JSON.stringify({ ...data, autoScale }),
      },
    });
  };

  return (
    <>
      <Stack direction='row' alignItems='center' spacing={1}>
        <Text fontSize='0.8rem'>Page</Text>

        <NumberInput
          sx={{ width: 100 }}
          value={data.pageNumber}
          onChange={(value) => assignPage(parseInt(value))}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Stack>

      <Tooltip
        title={
          <Text>
            Scale this component to try to match the user's device. Best used when this is the only
            component on the page.
          </Text>
        }>
        <ToggleButtonGroup
          disabled={disabled}
          size='small'
          value={autoScale ? ['autoScale'] : []}
          onChange={() => assignAutoScale(!autoScale)}>
          <ToggleButton value='autoScale' size='small'>
            <FitScreen fontSize='small' />
          </ToggleButton>
        </ToggleButtonGroup>
      </Tooltip>
    </>
  );
};
