/* eslint-disable @typescript-eslint/no-empty-interface */
import { compassDarkTheme } from '../../theme';

declare module '@mui/material/Dialog' {}

const injectTheme = (): void => {
  compassDarkTheme.components.MuiDialog = {
    variants: [],
    styleOverrides: {
      root: {
        '& .MuiPaper-root': {
          maxWidth: '100%',
        },
      },
    },
  };
};

export default injectTheme;
