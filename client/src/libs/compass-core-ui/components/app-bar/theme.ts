/* eslint-disable @typescript-eslint/no-empty-interface */
import { compassDarkTheme, compassLightTheme } from '../../theme';

declare module '@mui/material/AppBar' {}

const injectTheme = (): void => {
  [compassLightTheme, compassDarkTheme].forEach((theme) => {
    theme.components.MuiAppBar = {
      variants: [],
      styleOverrides: {
        root: {},
      },
    };
  });
};

export default injectTheme;
