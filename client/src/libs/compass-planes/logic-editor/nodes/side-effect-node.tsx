import { Attribute, AttributeType } from '@/libs/compass-api';
import { AttributeLookup } from '@/libs/compass-core-composites';
import { Stack } from '@chakra-ui/react';
import { useContext } from 'react';
import { useNodeId } from 'reactflow';
import { NodeWrapper } from '../components';
import { LogicContext } from '../provider';

export const SideEffectNode = () => {
  const {
    getOperation,
    getAttribute,
    updateOperation,
    attribute: logicAttribute,
  } = useContext(LogicContext);
  const operation = getOperation(useNodeId() ?? '');
  if (!operation) return null;

  const attributeId = operation.attributeRef;
  const attribute = getAttribute(attributeId);

  const onSelect = (attribute: Attribute | null) => {
    updateOperation({
      id: operation.id,
      attributeRef: attribute?.id ?? null,
    });
  };

  return (
    <NodeWrapper data={operation} style={{ width: 325 }}>
      <Stack spacing={2} padding={2}>
        <AttributeLookup
          className='nodrag'
          attributeId={attribute?.id}
          onSelect={onSelect}
          filterOutByType={[AttributeType.ACTION]}
          filterIds={logicAttribute ? [logicAttribute.id] : []}
        />
      </Stack>
    </NodeWrapper>
  );
};
