import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Text } from '../components/text';

interface AnimatedTextProps {
  variant: 'body1' | 'h6';
  duration: number;
  words: string[];
  delay?: number;
}

/**
 * Cycles through a given list of words, animating the transition between them.
 */
export const AnimatedText = ({ variant, duration, words, delay = 0 }: AnimatedTextProps) => {
  const [index, setIndex] = useState<number>(0);

  const interval = useRef<any | null>(null);

  useEffect(() => {
    const cycleWord = () => {
      setIndex((prev) => (prev + 1) % words.length);
    };

    clearInterval(interval.current);

    setTimeout(() => {
      interval.current = setInterval(cycleWord, duration * 1000);
    }, delay * 1000);
  }, [index]);

  return (
    <AnimatePresence initial={false}>
      <Text variant={variant}>
        <motion.span
          key={index}
          layout
          variants={{
            hidden: {
              opacity: 0,
            },
            show: {
              opacity: 1,
            },
          }}
          initial='hidden'
          animate='show'
          exit='hidden'
          transition={{ ease: 'easeOut', duration }}>
          {words[index]}
        </motion.span>
      </Text>
    </AnimatePresence>
  );
};
