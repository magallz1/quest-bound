import MUIPopper, { PopoverProps as MUIPopperProps } from '@mui/material/Popover';

export type PopperProps = MUIPopperProps;

export const Popper = ({ ...baseProps }: PopperProps): JSX.Element => <MUIPopper {...baseProps} />;
