import { Stack, Text } from '@chakra-ui/react';
import { useContext } from 'react';
import { Position, useNodeId } from 'reactflow';
import { CustomHandle, NodeWrapper } from '../components';
import { LogicContext } from '../provider';
import { IOType, operationTypeToIcon } from '../types';

export const ExponentNode = () => {
  const { getOperation } = useContext(LogicContext);
  const operation = getOperation(useNodeId() ?? '');
  if (!operation) return null;

  return (
    <NodeWrapper data={operation} style={{ width: 150 }} ignoreLabel>
      <Stack spacing={5} direction='row' align='center' width='100%'>
        <Stack mt='5px'>
          <Stack direction='row'>
            <CustomHandle
              id={`${operation.id}-${IOType.Parameter}:a`}
              position={Position.Left}
              type='target'
              ioType={IOType.Parameter}
              top={25}
            />
            <Text fontSize='0.9rem' fontStyle='italic' mt='2px'>
              A
            </Text>
          </Stack>

          <Stack direction='row'>
            <CustomHandle
              id={`${operation.id}-${IOType.Parameter}:b`}
              position={Position.Left}
              type='target'
              ioType={IOType.Parameter}
              top={55}
            />
            <Text fontSize='0.9rem' fontStyle='italic'>
              B
            </Text>
          </Stack>
        </Stack>
        <Text>{operationTypeToIcon.get(operation.type)}</Text>
      </Stack>
    </NodeWrapper>
  );
};
