import {
  Input,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Stack,
} from '@chakra-ui/react';
import { CSSProperties, ReactNode } from 'react';
import { HexAlphaColorPicker, HexColorPicker } from 'react-colorful';
import { Button, Paper, Tooltip } from '../components';
import './color-picker.css';

interface ColorPickerPopperProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
  onClose?: () => void;
  onSave?: () => void;
  saveLoading?: boolean;
  saveDisabled?: boolean;
  useAlpha?: boolean;
  useInput?: boolean;
  component?: ReactNode;
  swatches?: string[];
  style?: CSSProperties;
  verticalPosition?: number | 'center' | 'bottom' | 'top';
  horizontalPosition?: number | 'center' | 'left' | 'right';
  disabled?: boolean;
}

export const ColorPickerPopper = ({
  color,
  onClose,
  onChange,
  onSave,
  saveLoading,
  saveDisabled,
  useAlpha = false,
  useInput = true,
  component,
  swatches,
}: ColorPickerPopperProps) => {
  const props = { color: color || '#FFFFFF', onChange };

  return (
    <>
      <Popover onClose={onClose}>
        <PopoverTrigger>{component}</PopoverTrigger>
        <PopoverContent>
          <PopoverCloseButton />
          <Stack padding={2} spacing={2} alignItems='center'>
            {useAlpha ? <HexAlphaColorPicker {...props} /> : <HexColorPicker {...props} />}
            {useInput || !!onSave ? (
              <Stack direction='row' justifyContent='space-around' height='40px' spacing={1}>
                {useInput && (
                  <Input
                    id='hex-color-input'
                    style={{ width: '100px' }}
                    value={color}
                    onChange={(e) => onChange(e.target.value)}
                  />
                )}
                {onSave && (
                  <Tooltip title={saveDisabled ? 'Max number of colors set for this sheet.' : ''}>
                    <Button
                      loading={saveLoading}
                      disabled={saveDisabled}
                      onClick={onSave}
                      variant='text'>
                      Save to Palette
                    </Button>
                  </Tooltip>
                )}
              </Stack>
            ) : null}
            {swatches && swatches.length > 0 && (
              <Stack
                direction='row'
                width='100%'
                sx={{ padding: '4px', maxWidth: '200px', flexWrap: 'wrap', gap: '8px' }}>
                {swatches.map((color, i) => (
                  <Paper
                    key={i}
                    className='clickable'
                    style={{ height: '25px', width: '25px', backgroundColor: color }}
                    onClick={() => onChange(color)}
                  />
                ))}
              </Stack>
            )}
          </Stack>
        </PopoverContent>
      </Popover>
    </>
  );
};
