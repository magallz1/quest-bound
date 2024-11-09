import { motion } from 'framer-motion';
import React from 'react';

export function AnimatedUpdateMsg({
  value,
  isDerivedAttribute,
  children,
}: {
  value: number | string | null;
  isDerivedAttribute: boolean;
  children: React.ReactNode;
}) {
  if (!isDerivedAttribute) {
    return <>{children}</>;
  }

  return (
    <motion.div
      key={`${value}`}
      className='update-animation'
      initial={{ scale: 1 }}
      animate={{ scale: 1.2 }}
      transition={{ type: 'spring', duration: 0.1, repeat: 1, repeatType: 'reverse' }}>
      {children}
    </motion.div>
  );
}
