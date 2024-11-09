import { useMediaQuery } from '@mui/material';

export const useDeviceSize = () => {
  const mobile = useMediaQuery('(max-width:500px)');
  const tablet = useMediaQuery('(max-width:1200px)');

  return {
    mobile,
    tablet,
    desktop: !mobile && !tablet,
  };
};
