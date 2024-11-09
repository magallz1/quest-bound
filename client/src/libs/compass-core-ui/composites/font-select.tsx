import { Select, Stack } from '@chakra-ui/react';
import React from 'react';
import { MenuItem } from '../components/menu';
import { FormSelect } from './form/select';

export const FontFamilies = [
  'Roboto Condensed',
  'Arial',
  'Courier New',
  'Georgia',
  'Oswald',
  'Orbitron',
  'Audiowide',
  'MedievalSharp',
  'Yatra One',
  'Eagle Lake',
  'Bungee Shade',
  'Dancing Script',
  'Shadows Into Light',
  'Tilt Prism',
];

interface FontSelectProps {
  selected: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  useForm?: boolean;
  label?: string;
  id?: string;
  fullWidth?: boolean;
  style?: React.CSSProperties;
}

export const FontSelect = ({
  selected,
  disabled,
  onChange,
  useForm,
  label,
  id,
  fullWidth,
  style,
}: FontSelectProps) => {
  if (useForm) {
    return (
      <FormSelect
        id={id ?? 'font-select'}
        label={label ?? 'Select Font'}
        fullWidth={fullWidth}
        ignoreHelperText
        sx={{ fontFamily: selected }}
        disabled={disabled}>
        {FontFamilies.map((fontFamily) => (
          <MenuItem key={fontFamily} sx={{ fontFamily }} value={fontFamily}>
            {fontFamily}
          </MenuItem>
        ))}
      </FormSelect>
    );
  }

  return (
    <Stack style={{ width: '120px', ...style }}>
      <Select
        id={id ?? 'font-select'}
        value={selected}
        sx={{
          fontFamily: selected,
          backgroundColor: '#42403D',
          ...style,
        }}
        disabled={disabled}
        onChange={(e) => {
          onChange?.(e.target.value as string);
        }}>
        {FontFamilies.map((fontFamily) => (
          <option key={fontFamily} style={{ fontFamily }} value={fontFamily}>
            {fontFamily}
          </option>
        ))}
      </Select>
    </Stack>
  );
};
