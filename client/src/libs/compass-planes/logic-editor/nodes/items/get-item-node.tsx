import { Attribute, AttributeType } from '@/libs/compass-api';
import { AttributeLookup } from '@/libs/compass-core-composites';
import { Checkbox, Input, InputGroup, InputLeftAddon, Select } from '@chakra-ui/react';
import { Science } from '@mui/icons-material';
import { useContext } from 'react';
import { useNodeId } from 'reactflow';
import { NodeWrapper } from '../../components';
import { LogicContext } from '../../provider';
import { LogicalValue } from '../../types';

export const GetItemNode = () => {
  const { getOperation, updateOperation, getItem } = useContext(LogicContext);
  const operation = getOperation(useNodeId() ?? '');
  if (!operation) return null;

  const attributeId = operation.attributeRef;
  const item = getItem(attributeId);

  const selectedProperty = item?.properties.find(
    (property) => property.id === (operation.data?.selectedPropertyId ?? 'quantity'),
  );

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
          <InputGroup>
            <InputLeftAddon>
              <Science fontSize='small' />
            </InputLeftAddon>
            {selectedProperty?.type === AttributeType.BOOLEAN ? (
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
                type={selectedProperty?.type === AttributeType.NUMBER ? 'number' : 'text'}
                value={operation.data?.testValue}
                onChange={(e) => handleAttributeOverride(e.target.value)}
              />
            )}
          </InputGroup>
        </>
      )}
    </NodeWrapper>
  );
};
