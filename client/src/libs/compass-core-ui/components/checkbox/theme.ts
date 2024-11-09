/* eslint-disable @typescript-eslint/no-empty-interface */
import { compassDarkTheme, compassLightTheme } from '../../theme';

declare module '@mui/material/Checkbox' {}

const injectTheme = (): void => {
  [compassLightTheme, compassDarkTheme].forEach((theme) => {
    theme.components.MuiCheckbox = {
      variants: [],
      styleOverrides: {
        root: {
          '&.Mui-checked': {
            color: theme.palette.secondary.main,
          },
          '&.Mui-focusVisible': {
            outline: '1px solid',
            outlineColor: compassDarkTheme.palette.info.main,
            outlineOffset: '2px',
          },
        },
      },
    };
  });
};

export default injectTheme;
