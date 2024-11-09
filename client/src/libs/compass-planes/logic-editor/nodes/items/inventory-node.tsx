import { Input, InputGroup, InputLeftAddon, Text } from '@chakra-ui/react';
import { Science } from '@mui/icons-material';
import { useContext } from 'react';
import { useNodeId } from 'reactflow';
import { NodeWrapper } from '../../components';
import { LogicContext } from '../../provider';
import { LogicalValue } from '../../types';

export const InventoryNode = () => {
  const { getOperation, updateOperation } = useContext(LogicContext);
  const operation = getOperation(useNodeId() ?? '');
  if (!operation) return null;

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
      <Text>Weight</Text>

      <InputGroup>
        <InputLeftAddon>
          <Science fontSize='small' />
        </InputLeftAddon>

        <Input
          className='nodrag'
          size='s'
          width='100%'
          placeholder='Test Value'
          onChange={(e) => handleAttributeOverride(e.target.value)}
          value={operation.data?.testValue ?? ''}
          type='number'
        />
      </InputGroup>
    </NodeWrapper>
  );
};
