/* eslint-disable @typescript-eslint/no-empty-interface */
import { compassLightTheme } from '../../theme';

declare module '@mui/material/Drawer' {}

const injectTheme = (): void => {
  compassLightTheme.components.MuiDrawer = {
    variants: [],
    styleOverrides: {
      root: {},
    },
  };
};

export default injectTheme;
