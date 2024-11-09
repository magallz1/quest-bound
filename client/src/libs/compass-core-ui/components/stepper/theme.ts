/* eslint-disable @typescript-eslint/no-empty-interface */
import { compassLightTheme } from '../../theme';

declare module '@mui/material/Stepper' {}
declare module '@mui/material/Step' {}
declare module '@mui/material/StepLabel' {}

const injectTheme = (): void => {
  compassLightTheme.components.MuiStepper = {
    variants: [],
    styleOverrides: {
      root: {},
    },
  };
  compassLightTheme.components.MuiStep = {
    variants: [],
    styleOverrides: {
      root: {},
    },
  };
  compassLightTheme.components.MuiStepLabel = {
    variants: [],
    styleOverrides: {
      root: {},
    },
  };
};

export default injectTheme;
