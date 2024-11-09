import { AttributeType } from '@/libs/compass-api';
import { Checkbox, Input, Select } from '@chakra-ui/react';
import { useContext } from 'react';
import { useNodeId } from 'reactflow';
import { NodeWrapper } from '../../components';
import { LogicContext } from '../../provider';
import { EvaluationErrorType, LogicalValue } from '../../types';

export const PropertyNode = () => {
  const { getOperation, updateOperation, attribute } = useContext(LogicContext);
  const operation = getOperation(useNodeId() ?? '');
  if (!operation) return null;

  const data = operation.data ?? {};

  const manualError =
    attribute?.type !== AttributeType.ITEM
      ? {
          message: 'This node will only be used for items',
          operationId: operation.id,
          type: EvaluationErrorType.Custom,
        }
      : undefined;

  const setProperty = (key: string, value: LogicalValue) => {
    updateOperation({
      id: operation.id,
      data: {
        ...operation.data,
        [key]: value,
      },
    });
  };

  return (
    <NodeWrapper data={operation} manualError={manualError}>
      <Input
        placeholder='Property Name'
        value={data.name}
        onChange={(e) => setProperty('name', e.target.value)}
      />

      <Select
        value={data.type ?? AttributeType.NUMBER}
        onChange={(e) => setProperty('type', e.target.value)}>
        <option value={AttributeType.NUMBER}>Number</option>
        <option value={AttributeType.TEXT}>Text</option>
        <option value={AttributeType.BOOLEAN}>Boolean</option>
      </Select>

      {data.type === AttributeType.BOOLEAN ? (
        <Checkbox
          isChecked={operation.value === 'true'}
          onChange={(e) => setProperty('defaultValue', e.target.checked ? 'true' : 'false')}>
          Default Value
        </Checkbox>
      ) : (
        <Input
          className='nodrag'
          size='s'
          placeholder='Default Value'
          value={data.defaultValue ?? ''}
          onChange={(e) => setProperty('defaultValue', `${e.target.value}`)}
          sx={{ width: '250px' }}
          type={data.type === AttributeType.NUMBER ? 'number' : 'text'}
        />
      )}
    </NodeWrapper>
  );
};
