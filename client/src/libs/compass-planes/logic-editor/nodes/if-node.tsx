import { Text } from '@chakra-ui/react';
import { useContext } from 'react';
import { useNodeId } from 'reactflow';
import { NodeWrapper } from '../components';
import { LogicContext } from '../provider';

export const IfNode = () => {
  const { getOperation } = useContext(LogicContext);
  const operation = getOperation(useNodeId() ?? '');
  if (!operation) return null;

  return (
    <NodeWrapper data={operation} style={{ width: 100, height: 80 }} ignoreLabel>
      <Text>IF</Text>
    </NodeWrapper>
  );
};
