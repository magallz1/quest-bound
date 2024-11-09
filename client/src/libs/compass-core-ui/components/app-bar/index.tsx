import MUIAppBar, { AppBarProps as MUIAppBarProps } from '@mui/material/AppBar';

export type AppBarProps = MUIAppBarProps;

export const AppBar = ({ ...baseProps }: AppBarProps): JSX.Element => <MUIAppBar {...baseProps} />;
