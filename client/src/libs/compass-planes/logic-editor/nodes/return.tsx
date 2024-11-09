import { Stack, Text, Tooltip } from '@chakra-ui/react';
import { PriorityHigh } from '@mui/icons-material';
import { useContext } from 'react';
import { useNodeId } from 'reactflow';
import { NodeWrapper } from '../components';
import { LogicContext } from '../provider';

export const ReturnNode = () => {
  const { getOperation, updateOperation } = useContext(LogicContext);
  const operation = getOperation(useNodeId() ?? '');
  if (!operation) return null;

  const onToggleInverse = () => {
    updateOperation({
      id: operation.id,
      data: {
        ...operation.data,
        inverse: operation.data?.inverse ? false : true,
      },
    });
  };

  return (
    <NodeWrapper data={operation} ignoreLabel style={{ height: 60 }}>
      <Stack direction='row' width={'80px'} justifyContent='flex-end'>
        <Text>Return</Text>
      </Stack>

      <Tooltip label='Inverse boolean' aria-label='Inverse execution requirement' placement='right'>
        <PriorityHigh
          fontSize='small'
          onClick={onToggleInverse}
          role='button'
          sx={{
            color: operation.data?.inverse ? '#E66A3C' : 'inherit',
            position: 'absolute',
            top: 2,
            left: 26,
          }}
        />
      </Tooltip>
    </NodeWrapper>
  );
};
