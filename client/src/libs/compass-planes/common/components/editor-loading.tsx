import { motion } from 'framer-motion';

export const EditorLoading = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const horizontalLines = [];
  for (let i = 20; i < height; i += 20) {
    horizontalLines.push({
      y1: i,
      y2: i,
    });
  }

  const verticalLines = [];
  for (let i = 20; i < width; i += 20) {
    verticalLines.push({
      x1: i,
      x2: i,
    });
  }
  return (
    <motion.svg
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      height={height}
      width={width}
      style={{ overflow: 'hidden' }}>
      {horizontalLines.map((line, i) => (
        <motion.line
          key={`horizontal-line-${i}`}
          x1={20}
          x2={width}
          y1={line.y1}
          y2={line.y2}
          stroke='#fff'
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.1 }}
          transition={{
            pathLength: {
              type: 'spring',
              delay: i * 0.05,
              duration: 1.5,
              repeat: Infinity,
              repeatType: 'reverse',
              repeatDelay: 1.5,
            },
          }}
        />
      ))}
      {verticalLines.map((line, i) => (
        <motion.line
          key={`vertical-line-${i}`}
          x1={line.x1}
          x2={line.x2}
          y1={20}
          y2={height}
          stroke='#fff'
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.1 }}
          transition={{
            pathLength: {
              type: 'spring',
              delay: i * 0.05,
              duration: 1.5,
              repeat: Infinity,
              repeatType: 'reverse',
              repeatDelay: 1.5,
            },
          }}
        />
      ))}
    </motion.svg>
  );
};
