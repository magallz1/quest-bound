import { SxProps } from '@mui/material';
import { CSSProperties } from 'react';

export interface BaseProps {
  id?: string;

  className?: string;

  style?: CSSProperties;

  'data-testid'?: string;

  'aria-label'?: string;

  'aria-live'?: 'off' | 'assertive' | 'polite';

  'aria-labelledby'?: string;

  'aria-describedby'?: string;

  role?: string;

  sx?: SxProps;
}
