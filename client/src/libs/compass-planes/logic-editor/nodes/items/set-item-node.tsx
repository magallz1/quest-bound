import { Attribute, AttributeType } from '@/libs/compass-api';
import { AttributeLookup } from '@/libs/compass-core-composites';
import { Select } from '@chakra-ui/react';
import { useContext } from 'react';
import { useNodeId } from 'reactflow';
import { NodeWrapper } from '../../components';
import { LogicContext } from '../../provider';

export const SetItemNode = () => {
  const { getOperation, updateOperation, getItem } = useContext(LogicContext);
  const operation = getOperation(useNodeId() ?? '');
  if (!operation) return null;

  const attributeId = operation.attributeRef;
  const item = getItem(attributeId);

  const assignAttribute = (attribute: Attribute | null) => {
    updateOperation({
      id: operation.id,
      attributeRef: attribute?.id ?? null,
    });
  };

  const setProperty = (id: string) => {
    updateOperation({
      id: operation.id,
      data: {
        ...operation.data,
        selectedPropertyId: id,
      },
    });
  };

  return (
    <NodeWrapper data={operation}>
      <AttributeLookup
        className='nodrag'
        attributeId={item?.id}
        onSelect={assignAttribute}
        filterByType={AttributeType.ITEM}
      />

      {!!item && (
        <>
          <Select
            onChange={(e) => setProperty(e.target.value)}
            value={operation.data?.selectedPropertyId ?? 'quantity'}>
            {item.properties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.name}
              </option>
            ))}
          </Select>
        </>
      )}
    </NodeWrapper>
  );
};
