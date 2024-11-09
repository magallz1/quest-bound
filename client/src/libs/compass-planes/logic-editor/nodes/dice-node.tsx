import { Stack, Text } from '@chakra-ui/react';
import { Casino } from '@mui/icons-material';
import { useContext } from 'react';
import { useNodeId } from 'reactflow';
import { NodeWrapper } from '../components';
import { LogicContext } from '../provider';

export const DiceNode = () => {
  const { getOperation } = useContext(LogicContext);
  const operation = getOperation(useNodeId() ?? '');

  if (!operation) return null;

  return (
    <NodeWrapper data={operation} style={{ width: 100 }}>
      <Stack spacing={2} align='center'>
        <Casino />
        <Text>{operation.value}</Text>
      </Stack>
    </NodeWrapper>
  );
};
