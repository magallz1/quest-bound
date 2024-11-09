/* eslint-disable @typescript-eslint/no-empty-interface */
import { compassLightTheme } from '../../theme';

declare module '@mui/material/Autocomplete' {}

const injectTheme = (): void => {
  compassLightTheme.components.MuiAutocomplete = {
    variants: [],
    styleOverrides: {
      root: {},
    },
  };
};

export default injectTheme;
