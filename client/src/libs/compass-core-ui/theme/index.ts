import { Components, createTheme, responsiveFontSizes, Theme } from '@mui/material/styles';
import { components } from './components';
import { darkPalette, lightPalette } from './palette';
import { typography } from './typography';

interface CompassTheme extends Theme {
  components: Components;
}

export const compassLightTheme = responsiveFontSizes(
  createTheme({
    palette: lightPalette,
    typography,
    components,
  }),
) as CompassTheme;

export const compassDarkTheme = responsiveFontSizes(
  createTheme({
    palette: darkPalette,
    typography,
    components,
  }),
) as CompassTheme;
