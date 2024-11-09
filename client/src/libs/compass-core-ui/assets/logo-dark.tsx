import { CSSProperties } from 'react';
import LogoDarkSvg from './logo-dark.svg';

interface LogoProps {
  style?: CSSProperties;
}

export const LogoDark = ({ style }: LogoProps) => {
  return (
    <img
      alt='Quest Bound'
      src={LogoDarkSvg}
      style={{ maxWidth: '80vw', width: '100%', ...style }}
    />
  );
};
