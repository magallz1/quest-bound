/* eslint-disable @typescript-eslint/no-empty-interface */
import { compassLightTheme } from '../../theme';

declare module '@mui/material/SpeedDial' {}

const injectTheme = (): void => {
  compassLightTheme.components.MuiSpeedDial = {
    variants: [],
    styleOverrides: {
      root: {},
    },
  };
};

export default injectTheme;
