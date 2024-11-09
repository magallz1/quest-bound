import { CSSProperties, ReactNode } from 'react';
import { Stack } from '../components';

interface PageProps {
  children: ReactNode;
  style?: CSSProperties;
}

export const Page = ({ children, style }: PageProps) => {
  return (
    <Stack padding={2} style={style} className='page'>
      {children}
    </Stack>
  );
};
