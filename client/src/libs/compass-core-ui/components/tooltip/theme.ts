/* eslint-disable @typescript-eslint/no-empty-interface */
import { compassLightTheme } from '../../theme';

declare module '@mui/material/Tooltip' {}

const injectTheme = (): void => {
  compassLightTheme.components.MuiTooltip = {
    variants: [],
    styleOverrides: {},
  };
};

export default injectTheme;
