import MUIChip, { ChipProps as MUIChipProps } from '@mui/material/Chip';

export type ChipProps = MUIChipProps;

export const Chip = ({ ...baseProps }: ChipProps): JSX.Element => <MUIChip {...baseProps} />;
