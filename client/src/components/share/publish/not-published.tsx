import { Button, Stack, Text } from '@chakra-ui/react';
import { Newspaper } from '@mui/icons-material';

export const NotPublished = ({
  onPublish,
  loading,
}: {
  onPublish: () => void;
  loading?: boolean;
}) => {
  return (
    <Stack spacing={2} justify='center' align='center'>
      <Newspaper fontSize='large' />
      <Text fontSize='1.5rem'>Publish your content</Text>
      <Text textAlign='center'>
        Published content may be added to other users' shelves. You may unpublish at any time, but
        content on shelves will not be removed.
      </Text>
      <Button onClick={onPublish} isLoading={loading}>
        Publish
      </Button>
    </Stack>
  );
};
