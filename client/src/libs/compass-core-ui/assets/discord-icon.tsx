import React from 'react';
import DiscordImage from './discord-icon.png';

interface DiscordIconProps {
  style?: React.CSSProperties;
}

export const DiscordIcon = ({ style }: DiscordIconProps) => {
  return <img alt='Discord' src={DiscordImage} style={{ height: 40, width: 40, ...style }} />;
};
