import { ColorPickerPopper, IconButton, Tooltip } from '@/libs/compass-core-ui';
import { ColorLens, FormatColorFill, FormatColorText } from '@mui/icons-material';
import debounce from 'lodash.debounce';
import { useEffect, useMemo, useState } from 'react';

interface IconColorPikcerProps {
  color: string;
  onChange: (color: string) => void;
  onDebouncedChange?: (color: string) => void;
  palette?: string[];
  addColorToPalette?: (color: string) => void;
  debounceTime?: number;
  onOpen?: () => void;
  onClose?: () => void;
  type?: 'background' | 'font' | 'draw';
  disabled?: boolean;
  useAlpha?: boolean;
  tooltipPlacement?: 'top' | 'bottom' | 'right' | 'left';
  tooltipTitle?: string;
  stroke?: string;
}

/**
 * Provides a color change UI with optional saved palette.
 *
 * Debounces the onChange callback to 500ms by default.
 */
export const IconColorPicker = ({
  color,
  onChange,
  onDebouncedChange = () => {},
  onOpen,
  onClose,
  palette = [],
  addColorToPalette,
  debounceTime = 500,
  type = 'background',
  disabled,
  useAlpha = false,
  tooltipPlacement = 'bottom',
  tooltipTitle,
  stroke,
}: IconColorPikcerProps) => {
  const [fillColor, setFillColor] = useState<string>(color);

  const fillCoverWithoutAlpha = fillColor?.length === 7 ? fillColor : fillColor.slice(0, -2);

  const debouncedChange = useMemo(
    () => debounce(onDebouncedChange, debounceTime, { trailing: true }),
    [],
  );

  useEffect(() => {
    if (!fillColor) {
      setFillColor(color);
    }
  }, [color]);

  const renderIcon = () => {
    switch (type) {
      case 'font':
        return <FormatColorText sx={{ color: fillColor, stroke }} fontSize='small' />;
      case 'draw':
        return <ColorLens sx={{ color: fillColor, stroke }} fontSize='small' />;
      default:
        return <FormatColorFill sx={{ color: fillCoverWithoutAlpha, stroke }} fontSize='small' />;
    }
  };

  return (
    <ColorPickerPopper
      disabled={disabled}
      onClose={() => {
        onClose?.();
      }}
      color={fillColor}
      onSave={() => addColorToPalette?.(fillColor)}
      saveDisabled={palette.length >= 12}
      useAlpha={useAlpha}
      onChange={(newColor) => {
        // Optimistically update state because onChange is debounced.
        setFillColor(newColor);
        onChange(newColor);
        debouncedChange(newColor);
      }}
      swatches={palette}
      component={
        <Tooltip placement={tooltipPlacement} title={disabled ? '' : tooltipTitle}>
          <IconButton disabled={disabled} sx={{ opacity: disabled ? 0.25 : 1 }} onClick={onOpen}>
            {renderIcon()}
          </IconButton>
        </Tooltip>
      }
    />
  );
};
