/* eslint-disable @typescript-eslint/no-empty-interface */
import { compassLightTheme } from '../../theme';

declare module '@mui/material/CircularProgress' {}

const injectTheme = (): void => {
  compassLightTheme.components.MuiCircularProgress = {
    variants: [],
    styleOverrides: {
      root: {},
    },
  };
};

export default injectTheme;
