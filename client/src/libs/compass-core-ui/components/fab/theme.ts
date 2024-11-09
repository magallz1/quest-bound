/* eslint-disable @typescript-eslint/no-empty-interface */
import { compassDarkTheme } from '../../theme';

declare module '@mui/material/Fab' {}

const injectTheme = (): void => {
  compassDarkTheme.components.MuiFab = {
    variants: [],
    styleOverrides: {
      root: {},
    },
  };
};

export default injectTheme;
