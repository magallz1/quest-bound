import { Stack, Text } from '@chakra-ui/react';
import { useContext } from 'react';
import { useNodeId } from 'reactflow';
import { NodeWrapper } from '../components';
import { LogicContext } from '../provider';

export const SetNode = () => {
  const { getOperation } = useContext(LogicContext);
  const operation = getOperation(useNodeId() ?? '');
  if (!operation) return null;

  return (
    <NodeWrapper data={operation} ignoreLabel style={{ height: 60 }}>
      <Stack direction='row' width={'25px'} justifyContent='flex-end'>
        <Text>Set</Text>
      </Stack>
    </NodeWrapper>
  );
};
