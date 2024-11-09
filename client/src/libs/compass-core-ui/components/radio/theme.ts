/* eslint-disable @typescript-eslint/no-empty-interface */
import { compassDarkTheme, compassLightTheme } from '../../theme';

declare module '@mui/material/Radio' {}

const injectTheme = (): void => {
  [compassLightTheme, compassDarkTheme].forEach((theme) => {
    theme.components.MuiRadio = {
      variants: [],
      styleOverrides: {
        root: {
          '&.Mui-checked': {
            color: theme.palette.secondary.main,
          },
        },
      },
    };
  });
};

export default injectTheme;
