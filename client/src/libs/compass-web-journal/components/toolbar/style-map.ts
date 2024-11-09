import { FontFamilies } from '@/libs/compass-core-ui';
import { CSSProperties } from 'react';

export const styleMap: Record<string, CSSProperties> = {
  ALIGN_LEFT: {
    textAlign: 'left',
  },
  ALIGN_RIGHT: {
    textAlign: 'right',
  },
};

FontFamilies.forEach((family) => {
  styleMap[family] = {
    fontFamily: family,
  };
});

for (let i = 10; i <= 144; i++) {
  styleMap[`${i}px`] = {
    fontSize: `${i}px`,
  };
}
