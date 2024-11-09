import MUIText, { TypographyProps as MUITypographyProps } from '@mui/material/Typography';

export type TextProps = MUITypographyProps;

export const Text = ({ ...baseProps }: TextProps): JSX.Element => <MUIText {...baseProps} />;
