import { Attribute, AttributeType } from '@/libs/compass-api';
import { AttributeLookup } from '@/libs/compass-core-composites';
import { Stack, Text, Tooltip } from '@chakra-ui/react';
import { useContext, useEffect } from 'react';
import { Position, useNodeId, useUpdateNodeInternals } from 'reactflow';
import { CustomHandle, NodeWrapper } from '../components';
import { LogicContext } from '../provider';
import { IOType, Logic, OperationType } from '../types';

export const ActionNode = () => {
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

  const link = attribute
    ? `/rulesets/${attribute.rulesetId}/attributes/${attribute.id}`
    : undefined;

  const updateNodeInternals = useUpdateNodeInternals();

  const attributeLogic: Logic = attribute?.logic ? JSON.parse(attribute.logic) : [];

  const parameters = attributeLogic
    .filter((operation) => operation.type === OperationType.Variable)
    .sort((a, b) => a.y - b.y);

  useEffect(() => {
    updateNodeInternals(operation.id);
  }, [parameters.length]);

  const onSelect = (attribute: Attribute | null) => {
    updateOperation({
      id: operation.id,
      attributeRef: attribute?.id ?? null,
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
          filterByType={AttributeType.ACTION}
          filterIds={logicAttribute ? [logicAttribute.id] : []}
        />
        <Stack spacing={1}>
          {parameters.map((parameter, index) => (
            <Stack direction='row' spacing={2} key={index}>
              <CustomHandle
                id={`${operation.id}-${IOType.Parameter}:${parameter.id}`}
                position={Position.Left}
                type='target'
                ioType={IOType.Parameter}
                top={95 + (index + 1) * 24}
              />

              <Tooltip
                placement='right'
                label={
                  parameter.data?.defaultValue
                    ? `Defaults to ${parameter.data.defaultValue}`
                    : undefined
                }>
                <Text fontSize='0.9rem' fontStyle='italic' key={index}>
                  {`${parameter.variableName} (${parameter.variableType})`}
                </Text>
              </Tooltip>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </NodeWrapper>
  );
};
