import { Button, IconButton, InstagramIcon } from '@/libs/compass-core-ui';
import { CSSProperties, ReactNode } from 'react';

interface FollowInstagramProps {
  align?: 'start' | 'end';
  label?: ReactNode;
  size?: 'small' | 'medium' | 'large';
  style?: CSSProperties;
  iconButton?: boolean;
}

export const FollowInstagram = ({
  align = 'end',
  label = 'Follow',
  size = 'medium',
  style,
  iconButton,
}: FollowInstagramProps) => {
  const sizes = {
    small: { height: 20, width: 20 },
    medium: { height: 25, width: 25 },
    large: { height: 30, width: 30 },
  };

  if (iconButton) {
    return (
      <a target='_blank' href='https://www.instagram.com/quest_bound/'>
        <IconButton style={style}>
          <InstagramIcon style={sizes[size]} />
        </IconButton>
      </a>
    );
  }

  return (
    <Button
      style={style}
      endIcon={align === 'end' ? <InstagramIcon style={sizes[size]} /> : null}
      startIcon={align === 'start' ? <InstagramIcon style={sizes[size]} /> : null}
      target='_blank'
      href='https://www.instagram.com/quest_bound/'>
      {label}
    </Button>
  );
};
