import { Attribute, AttributeType } from '@/libs/compass-api';
import { AttributeLookup } from '@/libs/compass-core-composites';
import { Checkbox, Input, InputGroup, InputLeftAddon, Stack, Tooltip } from '@chakra-ui/react';
import { PriorityHigh, Science } from '@mui/icons-material';
import { useContext } from 'react';
import { useNodeId } from 'reactflow';
import { NodeWrapper } from '../components';
import { LogicContext } from '../provider';
import { LogicalValue } from '../types';

export const AttributeNode = () => {
  const { getOperation, getAttribute, updateOperation, overrideOperation } =
    useContext(LogicContext);
  const operation = getOperation(useNodeId() ?? '');
  if (!operation) return null;

  const attributeId = operation.attributeRef;
  const attribute = getAttribute(attributeId);

  const link = attribute
    ? `/rulesets/${attribute.rulesetId}/attributes/${attribute.id}`
    : undefined;

  const onSelect = (attribute: Attribute | null) => {
    updateOperation({
      id: operation.id,
      attributeRef: attribute?.id ?? null,
    });
  };

  const onToggleInverse = () => {
    updateOperation({
      id: operation.id,
      data: {
        ...operation.data,
        inverse: operation.data?.inverse ? false : true,
      },
    });
  };

  const handleAttributeOverride = (testValue: LogicalValue) => {
    updateOperation({
      id: operation.id,
      data: {
        ...operation.data,
        testValue,
      },
    });
  };

  return (
    <NodeWrapper
      data={operation}
      style={{ width: 325 }}
      description={attribute?.description ?? ''}
      link={link}>
      <Stack spacing={2} padding={2}>
        <AttributeLookup
          className='nodrag'
          attributeId={attribute?.id}
          onSelect={onSelect}
          filterOutByType={[AttributeType.ACTION]}
        />

        {attribute?.type === AttributeType.BOOLEAN && (
          <Tooltip label='Inverse boolean' aria-label='Inverse boolean' placement='right'>
            <PriorityHigh
              fontSize='small'
              onClick={onToggleInverse}
              role='button'
              sx={{
                color: operation.data?.inverse ? '#E66A3C' : 'inherit',
                position: 'absolute',
                bottom: 25,
                right: 5,
              }}
            />
          </Tooltip>
        )}
        <InputGroup>
          <InputLeftAddon>
            <Science fontSize='small' />
          </InputLeftAddon>
          {attribute?.type === AttributeType.BOOLEAN ? (
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
              type={attribute?.type === AttributeType.NUMBER ? 'number' : 'text'}
              value={operation.data?.testValue}
              onChange={(e) => handleAttributeOverride(e.target.value)}
            />
          )}
        </InputGroup>
      </Stack>
    </NodeWrapper>
  );
};
