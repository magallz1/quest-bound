import {
  AttributeType,
  InputComponentData,
  SheetComponent,
  UpdateSheetComponent,
} from '@/libs/compass-api';
import {
  FontSelect,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from '@/libs/compass-core-ui';
import {
  FormControl,
  FormLabel,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Switch,
} from '@chakra-ui/react';
import { Abc, KeyboardAlt, LooksOne } from '@mui/icons-material';
import { useEditorStore } from '../../../editor-store';
import { getInitialValues } from '../../../utils';
import { AssignAttribute } from './assign-attribute';
import { FontSize, TextAlign } from './common-actions';

export const InputEdit = ({
  components,
  disabled,
}: {
  components: SheetComponent[];
  disabled?: boolean;
}) => {
  const { sheetId, updateComponents } = useEditorStore();
  const initialValues = getInitialValues(components);

  const data = JSON.parse(initialValues.data) as InputComponentData;
  const css = JSON.parse(initialValues.style);

  const handleUpdate = (update: Partial<UpdateSheetComponent>) => {
    updateComponents({
      sheetId,
      updates: components.map((comp) => {
        const css = JSON.parse(comp.style);
        const data = JSON.parse(comp.data) as InputComponentData;
        return {
          id: comp.id,
          style: JSON.stringify({
            ...css,
            ...JSON.parse(update.style ?? '{}'),
          }),
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
          <Tooltip title={disabled ? '' : 'Input Type'}>
            <IconButton disabled={disabled}>
              <KeyboardAlt fontSize='small' />
            </IconButton>
          </Tooltip>
        </PopoverTrigger>
        <PopoverContent width='220px'>
          <Stack spacing={1} padding={2} align='center'>
            <ToggleButtonGroup
              exclusive
              sx={{ padding: 2 }}
              value={[data.type]}
              onChange={(_, type) => handleUpdate({ data: JSON.stringify({ type }) })}>
              <ToggleButton value='number' title='Number'>
                <LooksOne fontSize='small' />
              </ToggleButton>
              <ToggleButton value='text' title='Text'>
                <Abc />
              </ToggleButton>
            </ToggleButtonGroup>
            <FormControl display='flex' alignItems='center'>
              <FormLabel htmlFor='hide-wheel' mb='0'>
                Hide number wheel
              </FormLabel>
              <Switch
                id='hide-wheel'
                isChecked={data.hideWheel}
                onChange={(e) =>
                  handleUpdate({ data: JSON.stringify({ hideWheel: e.target.checked }) })
                }
              />
            </FormControl>
          </Stack>
        </PopoverContent>
      </Popover>

      <AssignAttribute
        data={data}
        onChange={handleUpdate}
        filterOutByType={[AttributeType.ACTION, AttributeType.BOOLEAN]}
      />

      <FontSelect
        disabled={disabled}
        selected={css.fontFamily}
        onChange={(fontFamily) => handleUpdate({ style: JSON.stringify({ fontFamily }) })}
      />

      <FontSize value={css.fontSize} disabled={disabled} onChange={handleUpdate} />

      <TextAlign
        disabled={disabled}
        alignment={css.textAlign}
        centerAlignment={css.centerAlign}
        onChange={handleUpdate}
        hideAlignTool
      />
    </>
  );
};
