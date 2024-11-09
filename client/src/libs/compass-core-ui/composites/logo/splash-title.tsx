import { motion } from 'framer-motion';
import React from 'react';
import { AnimatedText } from '../../animations/animated-text';
import { Stack } from '../../components/stack';
import { Text } from '../../components/text';
import { useDeviceSize } from '../../hooks/use-device-size';
interface SplashTitleProps {
  words?: string[];
  style?: React.CSSProperties;
  delay?: number;
}

export const SplashTitle = ({ words, style, delay = 0 }: SplashTitleProps) => {
  const { mobile } = useDeviceSize();
  const animatedWords = words ?? ['Create', 'Share', 'Play', 'Build', 'Explore'];

  return (
    <motion.div
      initial={{ opacity: 0, minWidth: mobile ? 360 : 450 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 1, ease: 'easeIn' }}>
      <Stack
        direction='row'
        width='100%'
        justifyContent='center'
        padding={4}
        sx={{ pb: 2, pt: 2, ...style }}>
        <Stack direction='row' justifyContent='flex-end' width={60}>
          <AnimatedText variant='h6' words={animatedWords} duration={3} delay={delay + 1} />
        </Stack>
        <Stack direction='row' justifyContent='start' sx={{ ml: '5px' }}>
          <Text variant='h6'>tabletop role playing games</Text>
        </Stack>
      </Stack>
    </motion.div>
  );
};
