/* eslint-disable @typescript-eslint/no-empty-interface */
import { compassDarkTheme } from '../../theme';

declare module '@mui/material/Avatar' {}

const injectTheme = (): void => {
  compassDarkTheme.components.MuiAvatar = {
    variants: [],
    defaultProps: {
      variant: 'rounded',
    },
    styleOverrides: {
      root: {},
    },
  };
};

export default injectTheme;
