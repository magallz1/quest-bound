/* eslint-disable @typescript-eslint/no-empty-interface */
import { compassLightTheme } from '../../theme';

declare module '@mui/material/Skeleton' {}

const injectTheme = (): void => {
  compassLightTheme.components.MuiSkeleton = {
    variants: [],
    styleOverrides: {
      root: {},
    },
  };
};

export default injectTheme;
