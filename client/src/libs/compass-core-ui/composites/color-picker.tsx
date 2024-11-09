import { CSSProperties } from 'react';
import { HexAlphaColorPicker, HexColorInput, HexColorPicker } from 'react-colorful';
import { Paper, Stack } from '../components';
import './color-picker.css';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  useAlpha?: boolean;
  useInput?: boolean;
  swatches?: string[];
  style?: CSSProperties;
}

export const ColorPicker = ({
  color,
  onChange,
  useAlpha = true,
  useInput = true,
  swatches,
  style,
}: ColorPickerProps) => {
  const props = { color: color || '#FFFFFF', onChange };

  return (
    <Stack
      spacing={1}
      className='color-picker'
      alignItems='center'
      justifyContent='center'
      style={style}>
      {useAlpha ? <HexAlphaColorPicker {...props} /> : <HexColorPicker {...props} />}
      {useInput && <HexColorInput {...props} className='color-picker-input' />}
      {swatches && swatches.length > 0 && (
        <Stack direction='row' width='100%' spacing={1}>
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
  );
};
