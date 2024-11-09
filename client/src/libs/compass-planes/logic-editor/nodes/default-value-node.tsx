import { AttributeType } from '@/libs/compass-api';
import { Checkbox, Input, Stack, Text } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { Position, useNodeId } from 'reactflow';
import { CustomHandle, NodeWrapper } from '../components';
import { LogicContext } from '../provider';
import { IOType, LogicalValue } from '../types';

export const DefaultValueNode = () => {
  const { attribute, updateOperation, getOperation, evaluatedLogic } = useContext(LogicContext);

  const attributeType = attribute?.type ?? AttributeType.TEXT;
  const operation = getOperation(useNodeId() ?? '');
  if (!operation) return null;

  let minValue: number | undefined;
  let maxValue: number | undefined;

  for (const op of evaluatedLogic) {
    for (const connection of op.connections) {
      if (connection.id === operation.id && connection.targetType.includes('parameter:a')) {
        if (!isNaN(parseFloat(`${op.value}`))) {
          minValue = parseFloat(`${op.value}`);
        }
      } else if (connection.id === operation.id && connection.targetType.includes('parameter:b')) {
        if (!isNaN(parseFloat(`${op.value}`))) {
          maxValue = parseFloat(`${op.value}`);
        }
      }
    }
  }

  const [value, setValue] = useState<LogicalValue>(
    operation.value ?? attribute?.defaultValue ?? '',
  );

  const handleChange = (value: string) => {
    const clampedValue = Math.min(
      Math.max(parseFloat(value), minValue ?? -Infinity),
      maxValue ?? Infinity,
    );

    setValue(clampedValue);
    updateOperation({
      id: operation.id,
      value: clampedValue,
    });
  };

  return (
    <NodeWrapper data={operation}>
      <Stack spacing={2} width='100px'>
        {attribute?.type === AttributeType.BOOLEAN ? (
          <Checkbox
            isChecked={operation.value === 'true'}
            onChange={(e) => handleChange(e.target.checked ? 'true' : 'false')}
          />
        ) : (
          <Input
            className='nodrag'
            size='s'
            placeholder='Enter a value'
            value={value}
            onChange={(e) => handleChange(`${e.target.value}`)}
            sx={{ width: '100px' }}
            type={attributeType === AttributeType.NUMBER ? 'number' : 'text'}
          />
        )}

        {attribute?.type === AttributeType.NUMBER && (
          <Stack mt='3px'>
            <Stack direction='row'>
              <CustomHandle
                id={`${operation.id}-${IOType.Parameter}:a`}
                position={Position.Left}
                type='target'
                ioType={IOType.Parameter}
                top={98}
              />
              <Text fontSize='0.9rem' fontStyle='italic' mt='2px'>
                Min
              </Text>
            </Stack>

            <Stack direction='row'>
              <CustomHandle
                id={`${operation.id}-${IOType.Parameter}:b`}
                position={Position.Left}
                type='target'
                ioType={IOType.Parameter}
                top={126}
              />
              <Text fontSize='0.9rem' fontStyle='italic'>
                Max
              </Text>
            </Stack>
          </Stack>
        )}
      </Stack>
    </NodeWrapper>
  );
};
