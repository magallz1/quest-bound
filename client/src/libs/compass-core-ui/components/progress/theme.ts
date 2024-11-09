/* eslint-disable @typescript-eslint/no-empty-interface */
import { compassLightTheme } from '../../theme';

declare module '@mui/material/LinearProgress' {}

const injectTheme = (): void => {
  compassLightTheme.components.MuiLinearProgress = {
    variants: [],
    styleOverrides: {
      root: {},
    },
  };
};

export default injectTheme;
