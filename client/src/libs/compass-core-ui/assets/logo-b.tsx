import { CSSProperties } from 'react';
import LogoBSvg from './qb-b.svg';

interface LogoProps {
  style?: CSSProperties;
}

export const LogoB = ({ style }: LogoProps) => {
  return (
    <img
      alt='B monogram from the logo'
      src={LogoBSvg}
      style={{ width: '200px', height: '200px', ...style }}
    />
  );
};
