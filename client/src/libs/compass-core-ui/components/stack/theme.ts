/* eslint-disable @typescript-eslint/no-empty-interface */
import { compassLightTheme } from '../../theme';

declare module '@mui/material/Stack' {}

const injectTheme = (): void => {
  compassLightTheme.components.MuiStack = {
    variants: [],
  };
};

export default injectTheme;
