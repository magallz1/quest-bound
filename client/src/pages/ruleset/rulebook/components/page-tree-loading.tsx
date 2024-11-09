import { Stack } from '@/libs/compass-core-ui';
import { motion } from 'framer-motion';

export const PageTreeLoading = () => (
  <Stack spacing={2} width='100%'>
    <motion.div
      initial={{
        width: 100,
        opacity: 0,
        height: 20,
        backgroundColor: '#42403D',
        borderRadius: '8px',
      }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
    />
    <motion.div
      initial={{
        marginLeft: 20,
        width: 100,
        opacity: 0,
        height: 20,
        backgroundColor: '#42403D',
        borderRadius: '8px',
      }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
    />
    <motion.div
      initial={{
        marginLeft: 20,
        width: 100,
        opacity: 0,
        height: 20,
        backgroundColor: '#42403D',
        borderRadius: '8px',
      }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
    />

    <motion.div
      initial={{
        width: 100,
        opacity: 0,
        height: 20,
        backgroundColor: '#42403D',
        borderRadius: '8px',
      }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
    />

    <motion.div
      initial={{
        marginLeft: 20,
        width: 100,
        opacity: 0,
        height: 20,
        backgroundColor: '#42403D',
        borderRadius: '8px',
      }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
    />

    <motion.div
      initial={{
        marginLeft: 40,
        width: 100,
        opacity: 0,
        height: 20,
        backgroundColor: '#42403D',
        borderRadius: '8px',
      }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
    />
  </Stack>
);
