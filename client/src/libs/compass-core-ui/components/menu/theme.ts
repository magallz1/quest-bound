/* eslint-disable @typescript-eslint/no-empty-interface */
import { compassDarkTheme, compassLightTheme } from '../../theme';

declare module '@mui/material/Menu' {}
declare module '@mui/material/MenuItem' {}

const injectTheme = (): void => {
  compassLightTheme.components.MuiMenu = {
    variants: [],
    styleOverrides: {
      root: {},
    },
  };

  compassDarkTheme.components.MuiMenuItem = {
    variants: [],
    styleOverrides: {
      root: {
        '&:hover': {
          backgroundColor: compassDarkTheme.palette.primary.main,
        },
        '&.Mui-selected': {
          backgroundColor: compassDarkTheme.palette.background.default,
          '&:hover': {
            backgroundColor: compassDarkTheme.palette.primary.main,
          },
        },
      },
    },
  };
};

export default injectTheme;
