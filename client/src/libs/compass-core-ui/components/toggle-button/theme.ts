/* eslint-disable @typescript-eslint/no-empty-interface */
import { compassDarkTheme, compassLightTheme } from '../../theme';

declare module '@mui/material/ToggleButton' {}

const injectTheme = (): void => {
  [compassLightTheme, compassDarkTheme].forEach((theme) => {
    theme.components.MuiToggleButton = {
      variants: [],
      styleOverrides: {
        root: {
          textTransform: 'none',
          '&:focus-visible': {
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
