import React from 'react';
import InstagramImage from './instagram-icon.png';

interface InstagramIconProps {
  style?: React.CSSProperties;
}

export const InstagramIcon = ({ style }: InstagramIconProps) => {
  return <img alt='Instagram' src={InstagramImage} style={{ height: 40, width: 40, ...style }} />;
};
