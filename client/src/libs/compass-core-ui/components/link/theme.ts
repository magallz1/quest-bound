/* eslint-disable @typescript-eslint/no-empty-interface */
import { compassLightTheme } from '../../theme';

declare module '@mui/material/Link' {}

const injectTheme = (): void => {
  compassLightTheme.components.MuiLink = {
    variants: [],
    styleOverrides: {
      root: {},
    },
  };
};

export default injectTheme;
