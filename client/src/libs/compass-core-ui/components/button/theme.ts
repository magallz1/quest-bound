import { compassDarkTheme, compassLightTheme } from '../../theme';

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    dashed: true;
  }
}

const injectTheme = (): void => {
  [compassLightTheme, compassDarkTheme].forEach((theme) => {
    theme.components.MuiButton = {
      defaultProps: {
        variant: 'contained',
      },
      styleOverrides: {
        root: {
          '&:focus-visible': {
            outline: '1px solid',
            outlineColor: compassDarkTheme.palette.info.main,
            outlineOffset: '2px',
          },

          textTransform: 'none',
          '&.MuiButton-text': {
            // color: theme.palette.text.primary,

            '&.MuiButton-textPrimary': {
              color: 'inherit',
            },

            '&.MuiButton-textError': {
              color: theme.palette.error.main,
            },

            '&.MuiButton-textSecondary': {
              color: theme.palette.secondary.main,
            },

            '&.Mui-disabled': {
              color: theme.palette.text.disabled,
            },

            // '&:hover': {
            //   backgroundColor: theme.palette.primary.main,
            // },
            // '&:active': {
            //   boxShadow:
            //     '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
            // },
          },
        },
      },
    };
  });
};

export default injectTheme;
