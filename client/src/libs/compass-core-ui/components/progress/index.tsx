import MUIProgress, { LinearProgressProps } from '@mui/material/LinearProgress';

export type ProgressProps = LinearProgressProps;

export const Progress = ({ ...baseProps }: ProgressProps): JSX.Element => (
  <MUIProgress {...baseProps} />
);
