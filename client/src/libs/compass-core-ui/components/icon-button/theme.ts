/* eslint-disable @typescript-eslint/no-empty-interface */
import { compassDarkTheme, compassLightTheme } from '../../theme';

declare module '@mui/material/IconButton' {}

const injectTheme = (): void => {
  [compassLightTheme, compassDarkTheme].forEach((theme) => {
    (theme.components.MuiSvgIcon = {
      defaultProps: {
        fontSize: 'small',
      },
    }),
      (theme.components.MuiIconButton = {
        variants: [],
        defaultProps: {
          size: 'small',
        },
        styleOverrides: {
          root: {
            borderRadius: '4px',
            color: theme.palette.text.primary,

            '&:focus-visible': {
              outline: '1px solid',
              outlineColor: compassDarkTheme.palette.info.main,
              outlineOffset: '2px',
            },

            '&.MuiIconButton-colorPimary': {
              color: `${theme.palette.primary.main} !important`,

              '&:hover': {
                color: `${theme.palette.primary.dark} !important`,
              },
            },

            '&.MuiIconButton-colorSecondary': {
              color: `${theme.palette.secondary.main} !important`,
            },

            '&.Mui-disabled': {
              color: theme.palette.text.disabled,
            },
          },
        },
      });
  });
};

export default injectTheme;
