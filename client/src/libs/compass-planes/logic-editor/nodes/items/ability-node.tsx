import { AttributeType } from '@/libs/compass-api';
import { Input, Textarea } from '@chakra-ui/react';
import { useContext } from 'react';
import { useNodeId } from 'reactflow';
import { NodeWrapper } from '../../components';
import { LogicContext } from '../../provider';
import { EvaluationErrorType } from '../../types';

export const AbilityNode = () => {
  const { getOperation, updateOperation, attribute } = useContext(LogicContext);
  const operation = getOperation(useNodeId() ?? '');
  if (!operation) return null;

  const manualError =
    attribute?.type !== AttributeType.ITEM
      ? {
          message: 'This node will only be used for items',
          operationId: operation.id,
          type: EvaluationErrorType.Custom,
        }
      : undefined;

  const setProperty = (name: string, value: string) => {
    updateOperation({
      id: operation.id,
      data: {
        ...operation.data,
        [name]: value,
      },
    });
  };

  return (
    <NodeWrapper data={operation} manualError={manualError}>
      <Input
        value={operation.data?.name ?? ''}
        onChange={(e) => setProperty('name', e.target.value)}
      />
      <Textarea
        value={operation.data?.description ?? ''}
        placeholder='Description'
        onChange={(e) => setProperty('description', e.target.value)}
      />
    </NodeWrapper>
  );
};
