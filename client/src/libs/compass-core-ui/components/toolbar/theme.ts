/* eslint-disable @typescript-eslint/no-empty-interface */
import { compassLightTheme } from '../../theme';

declare module '@mui/material/Toolbar' {}

const injectTheme = (): void => {
  compassLightTheme.components.MuiToolbar = {
    variants: [],
    styleOverrides: {
      root: {},
    },
  };
};

export default injectTheme;
