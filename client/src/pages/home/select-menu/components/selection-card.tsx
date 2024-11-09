import { Card, CardBody, CardHeader, Center, Heading, Image, Stack, Text } from '@chakra-ui/react';
import { Extension, FileCopy, Groups, Newspaper, Person, Verified } from '@mui/icons-material';
import ImageIcon from '@mui/icons-material/Image';
import { motion } from 'framer-motion';

interface Props {
  title: string;
  byLine?: string;
  onClick: () => void;
  img?: string | null;
  selected?: boolean;
  index?: number;
  published?: boolean;
  module?: boolean;
  player?: boolean;
  collaborator?: boolean;
  official?: boolean;
  copied?: boolean;
}

export const SelectionCard = ({
  title,
  byLine,
  img,
  selected,
  onClick,
  index = 0,
  published,
  module,
  player,
  collaborator,
  official,
  copied,
}: Props) => {
  const truncatedTitle = title.length > 35 ? `${title.slice(0, 35)}...` : title;

  return (
    <motion.div
      initial={{ transform: 'translateY(50px)' }}
      animate={{ transform: 'translateY(0px)' }}
      transition={{ duration: 0.1, delay: index * 0.05 }}>
      <motion.div whileHover={{ transform: 'translate(5px, -5px)', transition: { duration: 0.1 } }}>
        <Card
          onClick={onClick}
          style={{
            width: '300px',
            height: '350px',
            outline: selected ? `1px solid #E66A3C` : undefined,
          }}
          role='button'>
          <CardHeader sx={{ height: '70%', padding: 0 }}>
            <Image
              src={img ?? undefined}
              sx={{ height: '100%', width: '100%' }}
              alt={title}
              objectFit='cover'
              fallback={
                <Center style={{ height: '100%' }}>
                  <ImageIcon />
                </Center>
              }
            />
          </CardHeader>
          <CardBody sx={{ padding: 1, paddingLeft: 2, paddingRight: 2 }}>
            <Stack>
              <Stack direction='row' spacing={2}>
                {official && <Verified />}
                {player && <Person />}
                {collaborator && <Groups />}
                {module && <Extension />}
                {copied && <FileCopy />}
                {published && <Newspaper />}
              </Stack>
              <Heading size='md'>{truncatedTitle}</Heading>
              {byLine && (
                <Text fontSize='0.9rem' fontStyle='italic'>
                  {byLine}
                </Text>
              )}
            </Stack>
          </CardBody>
        </Card>
      </motion.div>
    </motion.div>
  );
};
