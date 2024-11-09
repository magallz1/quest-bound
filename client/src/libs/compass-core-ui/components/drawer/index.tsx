import MUIDrawer, { DrawerProps as MUIDrawerProps } from '@mui/material/Drawer';

export type DrawerProps = MUIDrawerProps;

export const Drawer = ({ ...baseProps }: DrawerProps): JSX.Element => <MUIDrawer {...baseProps} />;
