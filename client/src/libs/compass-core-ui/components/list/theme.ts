/* eslint-disable @typescript-eslint/no-empty-interface */
import { compassLightTheme } from '../../theme';

declare module '@mui/material/List' {}
declare module '@mui/material/ListItem' {}

const injectTheme = (): void => {
  compassLightTheme.components.MuiList = {
    variants: [],
    styleOverrides: {
      root: {},
    },
  };
  compassLightTheme.components.MuiListItem = {
    variants: [],
    styleOverrides: {
      root: {},
    },
  };
  compassLightTheme.components.MuiListItemButton = {
    variants: [],
    styleOverrides: {
      root: {},
    },
  };
  compassLightTheme.components.MuiListItemText = {
    variants: [],
    styleOverrides: {
      root: {},
    },
  };
  compassLightTheme.components.MuiListItemIcon = {
    variants: [],
    styleOverrides: {
      root: {},
    },
  };
};

export default injectTheme;
