import { Text } from '@chakra-ui/react';
import { useContext } from 'react';
import { useNodeId } from 'reactflow';
import { NodeWrapper } from '../components';
import { LogicContext } from '../provider';

export const NotNode = () => {
  const { getOperation } = useContext(LogicContext);
  const operation = getOperation(useNodeId() ?? '');

  if (!operation) return null;

  return (
    <NodeWrapper data={operation} ignoreLabel>
      <Text>NOT</Text>
    </NodeWrapper>
  );
};
