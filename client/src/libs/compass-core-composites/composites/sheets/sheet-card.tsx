import { Sheet, SheetType } from '@/libs/compass-api';
import { Card, CardContent, CardMedia, Stack, Text, useDeviceSize } from '@/libs/compass-core-ui';
import { Category, Image } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface SheetCardProps {
  sheet: Sheet;
  onClick?: () => void;
  selected?: boolean;
  animate?: boolean;
}

const animationDuration = 0.2;

export const SheetCard = ({ sheet, onClick, selected, animate = false }: SheetCardProps) => {
  const { mobile } = useDeviceSize();

  return (
    <motion.div
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
        {sheet.image ? (
          <CardMedia sx={{ height: 140 }} image={sheet.image?.src ?? ''} title={sheet.title} />
        ) : (
          <Stack
            sx={{ height: 140, bgcolor: 'primary.light' }}
            width='100%'
            alignItems='center'
            justifyContent='center'>
            <Image />
          </Stack>
        )}

        <CardContent>
          <Stack direction='row' spacing={1} alignItems='center' justifyContent='flex-start'>
            {sheet.type === SheetType.TEMPLATE && <Category fontSize='small' />}
            <Text variant='h5'>{sheet.title}</Text>
          </Stack>
          <Stack direction='row' spacing={1}>
            {sheet.type === SheetType.SHEET && (
              <Text variant='subtitle2' sx={{ fontStyle: 'italic' }}>
                {`Created from ${sheet.templateName}`}
              </Text>
            )}
            {sheet.type === SheetType.TEMPLATE && !!sheet.username && (
              <Text
                variant='subtitle2'
                sx={{ fontStyle: 'italic' }}>{`Created by ${sheet.username}`}</Text>
            )}
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};
