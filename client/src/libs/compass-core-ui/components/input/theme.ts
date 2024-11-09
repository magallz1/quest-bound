/* eslint-disable @typescript-eslint/no-empty-interface */
import { compassDarkTheme } from '../../theme';

declare module '@mui/material/TextField' {}

const injectTheme = (): void => {
  compassDarkTheme.components.MuiInput = {
    variants: [],
    defaultProps: {
      size: 'small',
    },
    styleOverrides: {
      root: {},
    },
  };

  compassDarkTheme.components.MuiTextField = {
    variants: [],
    defaultProps: {
      size: 'small',
    },
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-notchedOutline': {
          top: '0px',
          '& > legend': {
            display: 'none !important',
          },
        },
      },
    },
  };

  compassDarkTheme.components.MuiInputLabel = {
    styleOverrides: {
      root: {
        color: compassDarkTheme.palette.common.white,
        // top: -8,
        left: -8,

        '&.error': {
          color: `${compassDarkTheme.palette.error.main} !important`,
        },

        '&.Mui-focused': {
          color: compassDarkTheme.palette.common.white,
        },

        '&.Mui-disabled': {
          color: compassDarkTheme.palette.text.disabled,
        },
      },
    },
  };

  compassDarkTheme.components.MuiFormLabel = {
    styleOverrides: {
      root: {
        color: compassDarkTheme.palette.common.white,

        '&.error': {
          color: `${compassDarkTheme.palette.error.main} !important`,
        },

        '&.Mui-focused': {
          color: compassDarkTheme.palette.common.white,
        },

        '&.Mui-disabled': {
          color: compassDarkTheme.palette.text.disabled,
        },
      },
    },
  };

  compassDarkTheme.components.MuiInputBase = {
    variants: [],
    defaultProps: {
      size: 'small',
    },
    styleOverrides: {
      root: {
        '&:focus-within': {
          outline: '1px solid',
          outlineColor: compassDarkTheme.palette.common.white,
          outlineOffset: '1px',
        },

        backgroundColor: compassDarkTheme.palette.primary.main,
        '& .MuiSelect-icon': {
          color: compassDarkTheme.palette.common.white,

          '&.Mui-disabled': {
            color: compassDarkTheme.palette.text.disabled,
          },
        },
      },
    },
  };

  compassDarkTheme.components.MuiRadio = {
    styleOverrides: {
      root: {
        '&.Mui-focusVisible': {
          outline: '1px solid',
          outlineColor: compassDarkTheme.palette.info.main,
          outlineOffset: '2px',
        },
      },
    },
  };

  compassDarkTheme.components.MuiFormControl = {
    styleOverrides: {
      root: {
        '& .MuiInputLabel-root': {
          // Accounts for the offset of the input label
          top: -8,
        },
      },
    },
  };

  compassDarkTheme.components.MuiFormHelperText = {
    styleOverrides: {
      root: {
        marginLeft: '8px',
      },
    },
  };
};

export default injectTheme;
