import { IconColorPicker as IconColorPickerComposite } from '@/libs/compass-core-composites';
import { useEditorStore } from '../../../editor-store';
import { useSheetColors } from '../../../hooks';

interface IconColorPikcerProps {
  color: string;
  onChange: (color: string) => void;
  onOpen?: () => void;
  onClose?: () => void;
  type?: 'background' | 'font' | 'draw';
  disabled?: boolean;
  useAlpha?: boolean;
  tooltipPlacement?: 'top' | 'bottom' | 'right' | 'left';
  stroke?: string;
}

export const IconColorPicker = ({
  color,
  onChange,
  onOpen,
  onClose,
  type = 'background',
  disabled,
  useAlpha = false,
  tooltipPlacement = 'bottom',
  stroke,
}: IconColorPikcerProps) => {
  const { sheetId } = useEditorStore();
  const { colors, addColor } = useSheetColors(sheetId);

  const tooltipTitle =
    type === 'background' ? 'Background Color' : type === 'draw' ? 'Color' : 'Font Color';

  return (
    <IconColorPickerComposite
      color={color}
      stroke={stroke}
      onChange={onChange}
      onOpen={onOpen}
      onClose={onClose}
      palette={colors}
      addColorToPalette={addColor}
      type={type}
      disabled={disabled}
      useAlpha={useAlpha}
      tooltipPlacement={tooltipPlacement}
      tooltipTitle={tooltipTitle}
    />
  );
};
