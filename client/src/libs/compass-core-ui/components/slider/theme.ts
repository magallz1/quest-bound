/* eslint-disable @typescript-eslint/no-empty-interface */
import { compassDarkTheme } from '../../theme';

declare module '@mui/material/Slider' {}

const injectTheme = (): void => {
  compassDarkTheme.components.MuiSlider = {
    variants: [],
    styleOverrides: {
      root: {},
    },
  };
};

export default injectTheme;
