import MUISpeedDial, { SpeedDialProps as MUISpeedDialProps } from '@mui/material/SpeedDial';
import MUISpeedDialAction, {
  SpeedDialActionProps as MUISpeedDialActionProps,
} from '@mui/material/SpeedDialAction';

export type SpeedDialProps = MUISpeedDialProps;
export type SpeedDialActionProps = MUISpeedDialActionProps;

export const SpeedDial = ({ ...baseProps }: SpeedDialProps): JSX.Element => (
  <MUISpeedDial {...baseProps} />
);

export const SpeedDialAction = ({ ...baseProps }: SpeedDialActionProps): JSX.Element => (
  <MUISpeedDialAction {...baseProps} />
);
