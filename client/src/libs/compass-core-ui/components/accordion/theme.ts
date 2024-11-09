/* eslint-disable @typescript-eslint/no-empty-interface */
import { compassDarkTheme } from '../../theme';

declare module '@mui/material/Accordion' {}

const injectTheme = (): void => {
  compassDarkTheme.components.MuiAccordion = {
    variants: [],
  };

  compassDarkTheme.components.MuiAccordionSummary = {
    variants: [],
  };

  compassDarkTheme.components.MuiAccordionDetails = {
    variants: [],
  };
};

export default injectTheme;
