import { UpdateSheetComponent } from '@/libs/compass-api';
import { ToggleButton, Tooltip } from '@/libs/compass-core-ui';
import {
  AlignVerticalBottom,
  AlignVerticalCenter,
  AlignVerticalTop,
  FormatAlignCenter,
  FormatAlignLeft,
  FormatAlignRight,
} from '@mui/icons-material';

interface TextAlignProps {
  disabled?: boolean;
  alignment?: 'start' | 'center' | 'end';
  centerAlignment?: 'start' | 'center' | 'end';
  onChange: (value: Partial<UpdateSheetComponent>) => void;
  hideAlignTool?: boolean;
  hideJustifyTool?: boolean;
}

export const TextAlign = ({
  disabled,
  onChange,
  alignment = 'start',
  centerAlignment = 'center',
  hideAlignTool = false,
  hideJustifyTool = false,
}: TextAlignProps) => {
  const handleToggleJustify = () => {
    if (alignment === 'start') {
      onChange({ style: JSON.stringify({ textAlign: 'center' }) });
    } else if (alignment === 'center') {
      onChange({ style: JSON.stringify({ textAlign: 'end' }) });
    } else if (alignment === 'end') {
      onChange({ style: JSON.stringify({ textAlign: 'start' }) });
    }
  };

  const handleToggleAlignment = () => {
    if (centerAlignment === 'start') {
      onChange({ style: JSON.stringify({ centerAlign: 'center' }) });
    } else if (centerAlignment === 'center') {
      onChange({ style: JSON.stringify({ centerAlign: 'end' }) });
    } else if (centerAlignment === 'end') {
      onChange({ style: JSON.stringify({ centerAlign: 'start' }) });
    }
  };

  return (
    <>
      {!hideJustifyTool && (
        <Tooltip title='Justify'>
          <ToggleButton
            value='justify'
            size='small'
            disabled={disabled}
            onClick={handleToggleJustify}>
            {alignment === 'start' && <FormatAlignLeft fontSize='small' />}
            {alignment === 'center' && <FormatAlignCenter fontSize='small' />}
            {alignment === 'end' && <FormatAlignRight fontSize='small' />}
          </ToggleButton>
        </Tooltip>
      )}
      {!hideAlignTool && (
        <Tooltip title='Align'>
          <ToggleButton
            value='align'
            size='small'
            disabled={disabled}
            onClick={handleToggleAlignment}>
            {centerAlignment === 'start' && <AlignVerticalTop fontSize='small' />}
            {centerAlignment === 'center' && <AlignVerticalCenter fontSize='small' />}
            {centerAlignment === 'end' && <AlignVerticalBottom fontSize='small' />}
          </ToggleButton>
        </Tooltip>
      )}
    </>
  );
};
