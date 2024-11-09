import { useLottie } from 'lottie-react';
import { useDeviceSize } from '../hooks';
import LoadingAnimation from './loading.json';

export const AnimatedMonogram = () => {
  const { mobile } = useDeviceSize();
  const style = { height: mobile ? 250 : 500, width: mobile ? 250 : 500 };

  const { View } = useLottie({
    animationData: LoadingAnimation,
    loop: true,
    autoPlay: true,
    style,
  });

  return View;
};
