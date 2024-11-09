/* eslint-disable @typescript-eslint/no-empty-interface */
import { compassLightTheme } from '../../theme';

declare module '@mui/material/Breadcrumbs' {}

const injectTheme = (): void => {
  compassLightTheme.components.MuiBreadcrumbs = {
    variants: [],
    styleOverrides: {
      root: {},
    },
  };
};

export default injectTheme;
