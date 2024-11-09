import { Text } from '@chakra-ui/react';
import { useContext } from 'react';
import { useNodeId } from 'reactflow';
import { NodeWrapper } from '../components';
import { LogicContext } from '../provider';
import { operationTypeToLabel } from '../types';

export const BooleanComparisonNode = () => {
  const { getOperation } = useContext(LogicContext);
  const operation = getOperation(useNodeId() ?? '');

  if (!operation) return null;

  return (
    <NodeWrapper data={operation} ignoreLabel>
      <Text>{operationTypeToLabel.get(operation.type)}</Text>
    </NodeWrapper>
  );
};
