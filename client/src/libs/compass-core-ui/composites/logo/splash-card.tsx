import { motion } from 'framer-motion';
import React from 'react';
import { LogoDark } from '../../assets/logo-dark';
import { LogoIcon } from '../../assets/logo-icon';
import { LogoText } from '../../assets/logo-text';
import { Stack } from '../../components/stack';
import { Text } from '../../components/text';
import { useDeviceSize } from '../../hooks/use-device-size';
interface SplashCardProps {
  style?: React.CSSProperties;
  delay?: number;
}

export const SplashCard = ({ style }: SplashCardProps) => {
  const { mobile } = useDeviceSize();

  return (
    <Stack
      style={{ paddingBottom: 0, paddingTop: 0, ...style }}
      alignItems='center'
      justifyContent='center'
      spacing={2}
      padding={4}>
      <LogoDark style={{ height: mobile ? '100px' : '400px', width: mobile ? '100%' : '80%' }} />
      <Stack direction='row' width='100%' justifyContent='flex-end'>
        <Text variant='h5'>Tabletop Game Engine</Text>
      </Stack>
    </Stack>
  );
};

export const AnimatedSplashCard = ({ style, delay = 0 }: SplashCardProps) => {
  const initialDelay = delay;

  return (
    <Stack
      style={{ paddingBottom: 0, paddingTop: 0, width: '100%', ...style }}
      overflow='hidden'
      alignItems='center'
      justifyContent='center'
      spacing={2}
      padding={4}>
      <Stack direction='row' alignItems='center' position='relative'>
        <motion.div
          initial={{ position: 'relative', left: 200 }}
          animate={{ left: 35 }}
          transition={{ duration: 1.5, delay: initialDelay }}>
          <LogoIcon style={{ height: 300, width: 300 }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, position: 'relative', right: 0, top: 30 }}
          animate={{ opacity: 1, right: 0 }}
          transition={{ duration: 2, delay: initialDelay + 1 }}>
          <Stack alignItems='flex-end' spacing={1}>
            <LogoText style={{ height: 200 }} />

            <Stack width='80%' justifyContent='flex-end' direction='row' sx={{ pr: '30px' }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: initialDelay + 2 }}>
                <Text variant='h5'>Tabletop Game Engine</Text>
              </motion.div>
            </Stack>
          </Stack>
        </motion.div>
      </Stack>
    </Stack>
  );
};
