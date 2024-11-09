/* eslint-disable @typescript-eslint/no-empty-interface */
import { compassDarkTheme } from '../../theme';

declare module '@mui/material/Typography' {}

const injectTheme = (): void => {
  compassDarkTheme.components.MuiTypography = {
    variants: [],
    styleOverrides: {
      root: {
        color: 'inherit',
      },
    },
  };
};

export default injectTheme;
