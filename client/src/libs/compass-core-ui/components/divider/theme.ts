/* eslint-disable @typescript-eslint/no-empty-interface */
import { compassDarkTheme } from '../../theme';

declare module '@mui/material/Divider' {}

const injectTheme = (): void => {
  compassDarkTheme.components.MuiDivider = {
    variants: [],
    styleOverrides: {
      root: {
        borderColor: compassDarkTheme.palette.primary.light,
      },
    },
  };
};

export default injectTheme;
