import { DiscordIcon, IconButton } from '@/libs/compass-core-ui';
import { Link, Stack } from '@chakra-ui/react';
import { CSSProperties, ReactNode } from 'react';

interface JoinDiscordProps {
  align?: 'start' | 'end';
  label?: ReactNode;
  size?: 'small' | 'medium' | 'large';
  style?: CSSProperties;
  iconButton?: boolean;
}

export const JoinDiscord = ({
  align = 'end',
  label = 'Join the Community',
  size = 'medium',
  style,
  iconButton,
}: JoinDiscordProps) => {
  const sizes = {
    small: { height: 20, width: 20 },
    medium: { height: 25, width: 25 },
    large: { height: 30, width: 30 },
  };

  if (iconButton) {
    return (
      <a target='_blank' href='https://discord.gg/7QGV4muT39'>
        <IconButton style={style}>
          <DiscordIcon style={sizes[size]} />
        </IconButton>
      </a>
    );
  }

  return (
    <Stack direction='row' spacing={2} alignItems='center'>
      <DiscordIcon style={sizes[size]} />
      <Link
        href='https://discord.gg/7QGV4muT39'
        target='_blank'
        sx={{ '&:hover': { textDecoration: 'none' } }}>
        {label}
      </Link>
    </Stack>
  );
};
