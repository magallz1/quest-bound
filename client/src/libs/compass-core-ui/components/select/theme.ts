/* eslint-disable @typescript-eslint/no-empty-interface */
import { compassDarkTheme, compassLightTheme } from '../../theme';

declare module '@mui/material/Select' {}

const injectTheme = (): void => {
  compassLightTheme.components.MuiSelect = {
    variants: [],
    styleOverrides: {},
  };

  compassDarkTheme.components.MuiSelect = {
    variants: [],
    defaultProps: {
      size: 'small',
    },
    styleOverrides: {},
  };
};

export default injectTheme;
