import { UpdateSheetComponent } from '@/libs/compass-api';
import { FontSizeSelect } from '@/libs/compass-core-ui';

interface FontSizeProps {
  disabled?: boolean;
  autoScale?: boolean;
  value?: number;
  onChange: (update: Partial<UpdateSheetComponent>) => void;
}

export const FontSize = ({ disabled, autoScale, value, onChange }: FontSizeProps) => {
  return (
    <FontSizeSelect
      disabled={autoScale || disabled}
      onChange={(value) => onChange({ style: JSON.stringify({ fontSize: value }) })}
      value={value ?? 16}
      onBlur={() => {
        const currentSize = value ?? 16;
        if (currentSize < 10 || currentSize > 144) {
          onChange({
            style: JSON.stringify({
              fontSize: Math.max(10, Math.min(currentSize, 144)),
            }),
          });
        }
      }}
    />
  );
};
