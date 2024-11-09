/* eslint-disable @typescript-eslint/no-empty-interface */
import { compassDarkTheme } from '../../theme';

declare module '@mui/material/Switch' {}

const injectTheme = (): void => {
  compassDarkTheme.components.MuiSwitch = {
    variants: [],
    defaultProps: {
      size: 'small',
    },
    styleOverrides: {
      root: {
        '& .MuiSwitch-switchBase.Mui-checked': {
          color: compassDarkTheme.palette.secondary.main,
        },

        '& .MuiSwitch-switchBase': {
          '&.Mui-focusVisible': {
            outline: '1px solid',
            outlineColor: compassDarkTheme.palette.info.main,
            outlineOffset: '2px',
          },
        },
      },
    },
  };
};

export default injectTheme;
