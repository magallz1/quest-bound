import { Paper, Skeleton, Stack, Text } from '@/libs/compass-core-ui';

export const EditBarLoading = () => {
  return (
    <Paper sx={{ width: '100%' }}>
      <Stack
        direction='row'
        alignItems='center'
        justifyContent='space-between'
        height='60px'
        width='100%'
        sx={{
          gridRow: 1,
          pl: 2,
          pr: 2,
          borderBottom: '1px solid',
          borderColor: 'common.white',
        }}>
        <Skeleton>
          <Text>Loading sheet title</Text>
        </Skeleton>

        <Stack direction='row' spacing={2} width={300} justifyContent='end' alignItems='center'>
          <Skeleton variant='rectangular' width={100} height={35} />
        </Stack>
      </Stack>
    </Paper>
  );
};
