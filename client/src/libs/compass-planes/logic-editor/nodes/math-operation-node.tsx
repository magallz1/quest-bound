import {
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import { useContext } from 'react';
import { useNodeId } from 'reactflow';
import { NodeWrapper } from '../components';
import { LogicContext } from '../provider';
import { OperationType, operationTypeToIcon } from '../types';

export const MathOperationNode = () => {
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
    <NodeWrapper data={operation} style={{ width: 100 }} ignoreLabel>
      <Popover>
        <PopoverTrigger>
          <div
            role='button'
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {operationTypeToIcon.get(operation.type)}
          </div>
        </PopoverTrigger>

        <PopoverContent>
          <PopoverHeader>Change Type</PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>
            <Text role='button' onClick={() => switchType(OperationType.Add)}>
              Add
            </Text>
            <Text role='button' onClick={() => switchType(OperationType.Subtract)}>
              Subtract
            </Text>
            <Text role='button' onClick={() => switchType(OperationType.Multiply)}>
              Multiply
            </Text>
            <Text role='button' onClick={() => switchType(OperationType.Divide)}>
              Divide
            </Text>
            <Text role='button' onClick={() => switchType(OperationType.Round)}>
              Round
            </Text>
            <Text role='button' onClick={() => switchType(OperationType.RoundUp)}>
              Round Up
            </Text>
            <Text role='button' onClick={() => switchType(OperationType.RoundDown)}>
              Round Down
            </Text>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </NodeWrapper>
  );
};
