import MUILoader, { CircularProgressProps as MUILoaderProps } from '@mui/material/CircularProgress';

export type LoaderProps = MUILoaderProps;

export const Loader = ({ ...baseProps }: LoaderProps): JSX.Element => <MUILoader {...baseProps} />;
