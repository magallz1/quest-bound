import MUIRadio, { RadioProps as MUIRadioProps } from '@mui/material/Radio';

export type RadioProps = MUIRadioProps;

export const Radio = ({ ...baseProps }: RadioProps): JSX.Element => <MUIRadio {...baseProps} />;
