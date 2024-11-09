/* eslint-disable @typescript-eslint/no-empty-interface */
import { compassDarkTheme } from '../../theme';

declare module '@mui/material/Card' {}
declare module '@mui/material/CardActions' {}
declare module '@mui/material/CardContent' {}
declare module '@mui/material/CardMedia' {}

const injectTheme = (): void => {
  compassDarkTheme.components.MuiCard = {
    variants: [],
    styleOverrides: {
      root: {},
    },
  };
  compassDarkTheme.components.MuiCardActions = {
    variants: [],
    styleOverrides: {
      root: {},
    },
  };
  compassDarkTheme.components.MuiCardContent = {
    variants: [],
    styleOverrides: {
      root: {},
    },
  };
  compassDarkTheme.components.MuiCardMedia = {
    variants: [],
    styleOverrides: {
      root: {},
    },
  };
};

export default injectTheme;
