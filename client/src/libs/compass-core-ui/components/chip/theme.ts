/* eslint-disable @typescript-eslint/no-empty-interface */
import { compassLightTheme } from '../../theme';

declare module '@mui/material/Chip' {}

const injectTheme = (): void => {
  compassLightTheme.components.MuiChip = {
    variants: [],
    styleOverrides: {
      root: {},
    },
  };
};

export default injectTheme;
