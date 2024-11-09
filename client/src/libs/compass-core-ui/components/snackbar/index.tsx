import MUISnackbar, { SnackbarProps as MUISnackbarProps } from '@mui/material/Snackbar';
import { motion } from 'framer-motion';
import { forwardRef } from 'react';

export type SnackbarProps = MUISnackbarProps;

const AnimatedSnackbar = forwardRef((props: SnackbarProps, ref) => (
  <MUISnackbar ref={ref} {...props} />
));

export const Snackbar = motion(AnimatedSnackbar);
