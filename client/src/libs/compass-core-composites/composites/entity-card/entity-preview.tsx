import { Avatar, Skeleton, Stack, Text, useDeviceSize } from '@/libs/compass-core-ui';
import { Image } from '@mui/icons-material';
import { Entity } from './entity-card-slider';

interface Props {
  entity?: Entity | null;
  loading?: boolean;
}

export const EntityPreview = ({ entity, loading }: Props) => {
  const { mobile } = useDeviceSize();

  if (loading) {
    return (
      <Stack width={mobile ? '270px' : '400px'} alignItems='center' spacing={2}>
        <Skeleton height={250} width={250} />
        <Skeleton height={40} width={120} variant='text' />
      </Stack>
    );
  }

  return (
    <Stack width={mobile ? '270px' : '400px'} alignItems='center' spacing={2}>
      <Avatar
        sx={{
          width: 250,
          height: 250,
        }}
        src={entity?.image?.src ?? ''}>
        <Image />
      </Avatar>

      <Stack spacing={1} width='100%' alignItems='center'>
        <Text variant='h5'>{entity?.title ?? entity?.name ?? ''}</Text>
      </Stack>
    </Stack>
  );
};
