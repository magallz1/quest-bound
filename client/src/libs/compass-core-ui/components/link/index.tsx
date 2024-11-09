import MUILink, { LinkProps as MUILinkProps } from '@mui/material/Link';

export type LinkProps = MUILinkProps;

export const Link = ({ ...baseProps }: LinkProps): JSX.Element => <MUILink {...baseProps} />;
