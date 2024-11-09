import { Avatar } from '@/libs/compass-core-ui';
import { Image, Person } from '@mui/icons-material';
import React, { ReactNode } from 'react';

interface Props {
  src?: string;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  portrait?: boolean;
  variant?: 'circular' | 'square' | 'rounded';
  onClick?: () => void;
  placeholder?: ReactNode;
  alt?: string;
}

export const Img = ({
  id,
  className,
  src,
  alt,
  style,
  portrait,
  variant = 'square',
  placeholder,
  onClick,
}: Props) => (
  <Avatar
    id={id}
    src={src ?? ''}
    alt={alt}
    style={{ height: 60, width: 60, ...style }}
    imgProps={{ style: { objectFit: style?.objectFit } }}
    className={className}
    onClick={onClick}
    variant={variant}>
    {placeholder ?? (portrait ? <Person /> : <Image />)}
  </Avatar>
);
