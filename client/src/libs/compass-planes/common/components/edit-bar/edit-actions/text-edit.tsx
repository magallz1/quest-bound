import {
  AttributeType,
  SheetComponent,
  TextComponentData,
  UpdateSheetComponent,
} from '@/libs/compass-api';
import {
  FontSelect,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from '@/libs/compass-core-ui';
import { useKeyListeners } from '@/libs/compass-web-utils';
import { Popover, PopoverContent, PopoverTrigger, Textarea } from '@chakra-ui/react';
import { Edit, FitScreen, FormatBold, FormatItalic, FormatUnderlined } from '@mui/icons-material';
import { PlaneEditorType } from '../../../../types';
import { useEditorStore } from '../../../editor-store';
import { getInitialValues } from '../../../utils';
import { AssignAction } from './assign-action';
import { AssignAttribute } from './assign-attribute';
import { AssignLink } from './assign-link';
import { FontSize, TextAlign } from './common-actions';

export const TextEdit = ({
  components,
  disabled,
}: {
  components: SheetComponent[];
  disabled?: boolean;
}) => {
  const { sheetId, updateComponents, editorType } = useEditorStore();

  const initialValues = getInitialValues(components);

  const allowAttributeAssignment = editorType !== PlaneEditorType.MANAGE;

  const css = JSON.parse(initialValues.style);
  const data = JSON.parse(initialValues.data) as TextComponentData;

  const buttonGroupValues: string[] = [];
  if (css.fontStyle === 'italic') buttonGroupValues.push('italic');
  if (css.fontWeight === 'bold') buttonGroupValues.push('bold');
  if (css.textDecoration === 'underline') buttonGroupValues.push('underline');

  const autoScale = data.autoScale ?? false;

  const handleUpdate = (update: Partial<UpdateSheetComponent>) => {
    updateComponents({
      sheetId,
      updates: components
        .filter((c) => !c.locked)
        .map((comp) => {
          const css = JSON.parse(comp.style);
          const data = JSON.parse(comp.data) as TextComponentData;
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

  const toggleBold = () => {
    handleUpdate({
      style: JSON.stringify({
        fontWeight: css.fontWeight === 'bold' ? 'normal' : 'bold',
      }),
    });
  };

  const toggleItalic = () => {
    handleUpdate({
      style: JSON.stringify({
        fontStyle: css.fontStyle === 'italic' ? 'normal' : 'italic',
      }),
    });
  };

  const toggleUnderlined = () => {
    handleUpdate({
      style: JSON.stringify({
        textDecoration: css.textDecoration === 'underline' ? 'none' : 'underline',
      }),
    });
  };

  useKeyListeners({
    onKeyDown: (e) => {
      if (!e.meta && !e.control) return;
      if (e.key === 'b') {
        toggleBold();
      } else if (e.key === 'i') {
        toggleItalic();
      } else if (e.key === 'u') {
        toggleUnderlined();
      }
    },
  });

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Tooltip title={disabled ? '' : 'Edit Text'}>
            <IconButton>
              <Edit fontSize='small' />
            </IconButton>
          </Tooltip>
        </PopoverTrigger>
        <PopoverContent>
          <Textarea
            value={data.value}
            onChange={(e) => handleUpdate({ data: JSON.stringify({ value: e.target.value }) })}
            resize='vertical'
          />
        </PopoverContent>
      </Popover>

      {allowAttributeAssignment && (
        <AssignAttribute
          data={data}
          onChange={handleUpdate}
          showSignOption
          filterOutByType={[AttributeType.ACTION]}
        />
      )}

      {editorType === PlaneEditorType.SHEET && <AssignAction data={data} onChange={handleUpdate} />}

      <ToggleButtonGroup
        disabled={disabled}
        size='small'
        sx={{ bgcolor: 'primary.main' }}
        value={buttonGroupValues}>
        <ToggleButton value='bold' aria-label='bold' size='small' onClick={toggleBold}>
          <FormatBold fontSize='small' />
        </ToggleButton>
        <ToggleButton
          disabled={disabled}
          value='italic'
          aria-label='italic'
          size='small'
          onClick={toggleItalic}>
          <FormatItalic fontSize='small' />
        </ToggleButton>
        <ToggleButton
          disabled={disabled}
          value='underline'
          aria-label='underline'
          size='small'
          onClick={toggleUnderlined}>
          <FormatUnderlined fontSize='small' />
        </ToggleButton>
      </ToggleButtonGroup>
      <FontSelect
        disabled={disabled}
        selected={css.fontFamily}
        onChange={(fontFamily) => handleUpdate({ style: JSON.stringify({ fontFamily }) })}
        style={{ minWidth: 165 }}
      />

      <FontSize
        value={css.fontSize}
        disabled={disabled}
        onChange={handleUpdate}
        autoScale={data.autoScale}
      />

      <Tooltip title='Auto Scale'>
        <ToggleButtonGroup
          disabled={disabled}
          size='small'
          value={autoScale ? ['autoScale'] : []}
          onChange={() => handleUpdate({ data: JSON.stringify({ autoScale: !autoScale }) })}>
          <ToggleButton value='autoScale' size='small'>
            <FitScreen fontSize='small' />
          </ToggleButton>
        </ToggleButtonGroup>
      </Tooltip>

      <TextAlign
        disabled={disabled}
        alignment={css.textAlign}
        centerAlignment={css.centerAlign}
        onChange={handleUpdate}
      />

      {editorType !== PlaneEditorType.MANAGE && (
        <AssignLink onChange={handleUpdate} data={data} disabled={disabled} />
      )}
    </>
  );
};
