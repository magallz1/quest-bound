import { AttributeType } from '@/libs/compass-api';
import { Checkbox, Input, InputGroup, InputLeftAddon, Select, Stack, Text } from '@chakra-ui/react';
import { Science } from '@mui/icons-material';
import { useContext, useState } from 'react';
import { useNodeId } from 'reactflow';
import { NodeWrapper } from '../components';
import { LogicContext } from '../provider';
import { LogicalValue } from '../types';

export const VariableNode = () => {
  const { getOperation, updateOperation, attribute } = useContext(LogicContext);
  const operation = getOperation(useNodeId() ?? '');
  if (!operation) return null;

  const isAction = attribute?.type === AttributeType.ACTION;

  const [name, setName] = useState<string>(operation.variableName ?? '');

  const onChange = (target: string, value: string) => {
    if (target === 'variableName') setName(value);
    updateOperation({
      id: operation.id,
      [target]: value,
    });
  };

  const handleAttributeOverride = (testValue: LogicalValue) => {
    updateOperation({
      id: operation.id,
      data: { testValue },
    });
  };

  const setDefault = (defaultValue: LogicalValue) => {
    updateOperation({
      id: operation.id,
      data: { defaultValue },
    });
  };

  const onSelect = (type: AttributeType) => {
    updateOperation({
      id: operation.id,
      variableType: type,
    });
  };

  return (
    <NodeWrapper data={operation} style={{ width: 300 }}>
      <Stack spacing={2} padding={2}>
        <Stack spacing={1}>
          <Text size='s'>{isAction ? 'Parameter Name' : 'Variable Name'}</Text>
          <Input
            className='nodrag'
            value={name}
            onChange={(e) => onChange('variableName', e.target.value)}
          />
        </Stack>

        {attribute?.type === AttributeType.ACTION && (
          <Stack spacing={2}>
            <Text size='s'>Parameter Type</Text>

            <Select
              value={operation.variableType}
              onChange={(e) => onSelect(e.target.value as AttributeType)}>
              <option value={AttributeType.NUMBER}>Number</option>
              <option value={AttributeType.TEXT}>Text</option>
              <option value={AttributeType.BOOLEAN}>Boolean</option>
            </Select>

            {operation.variableType === AttributeType.BOOLEAN ? (
              <Checkbox
                sx={{ ml: 3 }}
                isChecked={operation.data?.defaultValue === 'true'}
                onChange={(e) => setDefault(e.target.checked ? 'true' : 'false')}
              />
            ) : (
              <Input
                className='nodrag'
                size='s'
                width='100%'
                placeholder='Default Value'
                type={operation.variableType === AttributeType.NUMBER ? 'number' : 'text'}
                value={operation.data?.defaultValue}
                onChange={(e) => setDefault(e.target.value)}
              />
            )}

            <InputGroup>
              <InputLeftAddon>
                <Science fontSize='small' />
              </InputLeftAddon>
              {operation.variableType === AttributeType.BOOLEAN ? (
                <Checkbox
                  sx={{ ml: 3 }}
                  isChecked={operation.data?.testValue === 'true'}
                  onChange={(e) => handleAttributeOverride(e.target.checked ? 'true' : 'false')}
                />
              ) : (
                <Input
                  className='nodrag'
                  size='s'
                  width='100%'
                  placeholder='Test Value'
                  type={operation.variableType === AttributeType.NUMBER ? 'number' : 'text'}
                  value={operation.data?.testValue}
                  onChange={(e) => handleAttributeOverride(e.target.value)}
                />
              )}
            </InputGroup>
          </Stack>
        )}
      </Stack>
    </NodeWrapper>
  );
};
