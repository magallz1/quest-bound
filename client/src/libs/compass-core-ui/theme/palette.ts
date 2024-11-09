import { PaletteColorOptions, PaletteOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface PaletteOptions {
    brass: PaletteColorOptions;
    water: PaletteColorOptions;
    sand: PaletteColorOptions;
  }
}

const common = {
  black: '#2A2A2A',
  white: '#FAF7F2',
};

const darkMain = '#42403D';
const lightMain = '#CFCAB0';

export const lightPalette: PaletteOptions = {
  common,
  text: {
    primary: common.black,
    secondary: common.black,
    disabled: 'rgba(0, 0, 0, 0.25)',
  },
  background: {
    default: common.white,
    paper: common.white,
  },
  primary: {
    main: lightMain,
    contrastText: common.black,
  },
  secondary: {
    main: '#E66A3C',
    contrastText: common.white,
  },
  info: {
    main: '#417090',
    contrastText: common.white,
  },
  success: {
    main: '#36A800',
  },
  error: {
    main: '#E74323',
  },
  brass: {
    main: '#D4C05F',
  },
  water: {
    main: '#417090',
  },
  sand: {
    main: '#D5A658',
  },
};

export const darkPalette: PaletteOptions = {
  ...lightPalette,
  mode: 'dark',
  background: {
    default: common.black,
    paper: common.black,
  },
  text: {
    primary: common.white,
    secondary: common.white,
    disabled: 'rgba(255, 255, 255, 0.25)',
  },
  primary: {
    main: darkMain,
    contrastText: common.white,
  },
};
