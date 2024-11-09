/* eslint-disable @typescript-eslint/no-empty-interface */
import { compassDarkTheme } from '../../theme';

declare module '@mui/material/Snackbar' {}

const injectTheme = (): void => {
  compassDarkTheme.components.MuiSnackbar = {
    variants: [],
    styleOverrides: {
      root: {},
    },
  };
};

export default injectTheme;
