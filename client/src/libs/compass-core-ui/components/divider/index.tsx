import MUIDivider, { DividerProps as MUIDividerProps } from '@mui/material/Divider';

export type DividerProps = MUIDividerProps;

export const Divider = ({ ...baseProps }: DividerProps): JSX.Element => (
  <MUIDivider {...baseProps} />
);
