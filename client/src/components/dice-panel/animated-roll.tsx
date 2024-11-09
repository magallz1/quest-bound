import { Text } from '@/libs/compass-core-ui';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect } from 'react';

interface AnimatedRollProps {
  value: number;
  duration: number;
  variant?: 'h3';
  min?: number;
  max: number;
}

export const AnimatedRoll = ({ value, duration, variant, min, max }: AnimatedRollProps) => {
  const renderedValue = useMotionValue(0);
  const rounded = useTransform(renderedValue, Math.round);

  useEffect(() => {
    const keyFrames = [];

    const minimum = min || 0;

    for (let i = 0; i < duration * 10; i++) {
      const randomNumberInRange = Math.floor(Math.random() * (max - minimum + 1)) + minimum;
      // One can never roll a 0
      keyFrames.push(randomNumberInRange === 0 ? 1 : randomNumberInRange);
    }

    keyFrames.push(value);
    const animation = animate(renderedValue, keyFrames, { duration });

    return animation?.stop;
  }, []);

  return (
    <Text variant={variant} sx={{ color: 'secondary.main' }}>
      <motion.span>{rounded}</motion.span>
    </Text>
  );
};
