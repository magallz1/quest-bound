import {
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useContext } from 'react';
import { Position, useNodeId } from 'reactflow';
import { CustomHandle, NodeWrapper } from '../components';
import { LogicContext } from '../provider';
import { IOType, OperationType, operationTypeToIcon } from '../types';

export const ComparisonNode = () => {
  const { getOperation, updateOperation } = useContext(LogicContext);
  const operation = getOperation(useNodeId() ?? '');
  if (!operation) return null;

  const switchType = (type: OperationType) => {
    updateOperation({
      id: operation.id,
      type,
    });
  };

  return (
    <NodeWrapper data={operation} style={{ width: 120, height: 60 }} ignoreLabel>
      <Stack spacing={5} direction='row' align='center' width='100%'>
        <Stack mt='3px'>
          <Stack direction='row'>
            <CustomHandle
              id={`${operation.id}-${IOType.Parameter}:a`}
              position={Position.Left}
              type='target'
              ioType={IOType.Parameter}
              top={17}
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
              top={45}
            />
            <Text fontSize='0.9rem' fontStyle='italic'>
              B
            </Text>
          </Stack>
        </Stack>
        <Popover>
          <PopoverTrigger>
            <Text role='button'>{operationTypeToIcon.get(operation.type)}</Text>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverCloseButton />
            <PopoverHeader>Change Type</PopoverHeader>
            <PopoverBody>
              <Text role='button' onClick={() => switchType(OperationType.Equal)}>
                Equal
              </Text>
              <Text role='button' onClick={() => switchType(OperationType.NotEqual)}>
                Not Equal
              </Text>
              <Text role='button' onClick={() => switchType(OperationType.GreaterThan)}>
                Greater Than
              </Text>
              <Text role='button' onClick={() => switchType(OperationType.LessThan)}>
                Less Than
              </Text>
              <Text role='button' onClick={() => switchType(OperationType.GreaterThanOrEqual)}>
                Greater Than or Equal
              </Text>
              <Text onClick={() => switchType(OperationType.LessThanOrEqual)}>
                Less Than or Equal
              </Text>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Stack>
    </NodeWrapper>
  );
};
