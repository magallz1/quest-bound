import { ContextualAttribute } from '@/libs/compass-api';
import { Tooltip } from '@/libs/compass-core-ui';
import { Button, Stack, Text } from '@chakra-ui/react';

interface Props {
  triggerAction: () => void;
  attribute: ContextualAttribute;
  attributeDescription?: string | null;
  loading: boolean;
}

export const ActionAttributeNode = ({
  triggerAction,
  attribute,
  attributeDescription,
  loading,
}: Props) => {
  return (
    <Stack>
      <Tooltip
        title={!!attributeDescription ? <Text>{attributeDescription}</Text> : null}
        placement='left'
        enterDelay={500}>
        <Button isLoading={loading} onClick={triggerAction}>
          {attribute.name}
        </Button>
      </Tooltip>
    </Stack>
  );
};
