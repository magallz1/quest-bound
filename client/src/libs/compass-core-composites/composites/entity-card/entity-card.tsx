import { Image } from '@/libs/compass-api';
import { Card, CardContent, CardMedia, Stack, Text, useDeviceSize } from '@/libs/compass-core-ui';
import { Image as ImageIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import React from 'react';

interface EntityCardProps {
  title: string;
  image?: Image | null;
  subtitle?: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
  animate?: boolean;
}

const animationDuration = 0.2;

export const EntityCard = ({
  title,
  subtitle,
  image,
  onClick,
  selected,
  animate = false,
}: EntityCardProps) => {
  const { mobile } = useDeviceSize();

  return (
    <motion.div
      style={{ height: 240 }}
      transition={{ duration: animationDuration }}
      whileHover={animate ? { translateX: 10, translateY: 10 } : {}}>
      <Card
        sx={{
          width: mobile ? 230 : 280,
          minHeight: 240,
          outline: selected ? '2px solid' : 'none',
          outlineColor: 'common.white',
        }}
        className='clickable'
        onClick={onClick}>
        {image ? (
          <CardMedia sx={{ height: 140 }} image={image?.src ?? ''} title={title} />
        ) : (
          <Stack
            sx={{ height: 140, bgcolor: 'primary.light' }}
            width='100%'
            alignItems='center'
            justifyContent='center'>
            <ImageIcon />
          </Stack>
        )}

        <CardContent>
          <Stack direction='row' spacing={1} alignItems='center' justifyContent='flex-start'>
            <Text variant='h5'>{title}</Text>
          </Stack>
          {subtitle && (
            <Stack direction='row' spacing={1}>
              <Text variant='subtitle2' sx={{ fontStyle: 'italic' }}>
                {subtitle}
              </Text>
            </Stack>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
