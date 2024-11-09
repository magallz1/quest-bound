/* eslint-disable @typescript-eslint/no-empty-interface */
import { compassDarkTheme, compassLightTheme } from '../../theme';

declare module '@mui/material/Tabs' {}
declare module '@mui/material/Tab' {}

const injectTheme = (): void => {
  [compassLightTheme, compassDarkTheme].forEach((theme) => {
    theme.components.MuiTab = {
      variants: [],
      styleOverrides: {
        root: {
          textTransform: 'none',
          '&.Mui-selected': {
            color: theme.palette.secondary.main,
          },
        },
      },
    };

    theme.components.MuiTabs = {
      variants: [],
      styleOverrides: {
        root: {
          '& .MuiTabs-scroller': {
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.secondary.main,
              opacity: 0.5,
            },
          },
        },
      },
    };
  });
};

export default injectTheme;
