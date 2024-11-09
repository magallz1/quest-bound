/* eslint-disable @typescript-eslint/no-empty-interface */
import { compassLightTheme } from '../../theme';

declare module '@mui/material/Paper' {}

const injectTheme = (): void => {
  compassLightTheme.components.MuiPaper = {
    variants: [],
    styleOverrides: {
      root: {},
    },
  };
};

export default injectTheme;
