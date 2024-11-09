import { CSSProperties } from 'react';
import LogoQSvg from './qb-q.svg';

interface LogoProps {
  style?: CSSProperties;
}

export const LogoQ = ({ style }: LogoProps) => {
  return (
    <img
      alt='Q monogram from the logo'
      src={LogoQSvg}
      style={{ width: '200px', height: '200px', ...style }}
    />
  );
};
