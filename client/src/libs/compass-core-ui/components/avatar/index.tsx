import MUIAvatar, { AvatarProps as MUIAvatarProps } from '@mui/material/Avatar';

export type AvatarProps = MUIAvatarProps;

export const Avatar = ({ ...baseProps }: AvatarProps): JSX.Element => <MUIAvatar {...baseProps} />;
