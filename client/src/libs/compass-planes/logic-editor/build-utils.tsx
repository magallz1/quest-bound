import { AttributeType } from '@/libs/compass-api';
import { generateId } from '@/libs/compass-web-utils';
import { Connection, Edge, Node } from 'reactflow';
import { Coordinates } from '../types';
import { IOType, Logic, Operation, OperationType } from './types';

export function buildNodeFromOperation(op: Operation): Node {
  return {
    id: op.id,
    position: {
      x: op.x,
      y: op.y,
    },
    data: op.id,
    type: op.type,
  };
}

export function buildEdgesFromLogic(logic: Logic): Edge[] {
  const edges: Edge[] = [];
  for (const operation of logic) {
    for (const { id, sourceType, targetType, data } of operation.connections) {
      edges.push({
        id: `${operation.id}:${sourceType}=>${id}:${targetType}`,
        type: 'custom-edge',
        source: operation.id,
        target: id,
        sourceHandle: `${operation.id}-${sourceType}`,
        targetHandle: `${id}-${targetType}${targetType === IOType.Parameter ? data : ''}`,
        data: {
          sourceIOType: sourceType,
          targetIOType: targetType,
          data,
        },
      });
    }
  }

  return edges;
}

const defaultDataByType = new Map<OperationType, any>([
  [OperationType.Property, { type: AttributeType.NUMBER, name: '', id: '', value: '' }],
  [OperationType.GetItem, { selectedPropertyId: 'quantity' }],
  [OperationType.SetItem, { selectedPropertyId: 'quantity' }],
]);

export const bootstrapOperation = (
  type: OperationType,
  coordinates: Coordinates,
  initialData?: Partial<Operation>,
): Operation => {
  const initialValue = (() => {
    switch (type) {
      case OperationType.Number:
        return '0';
      case OperationType.Boolean:
        return 'false';
      case OperationType.Comment:
        return 'Leave a comment...';
      default:
        return '';
    }
  })();

  return {
    id: generateId(),
    x: coordinates.x,
    y: coordinates.y,
    type,
    data: defaultDataByType.get(type) ?? {},
    connections: [],
    attributeRef: null,
    chartRef: null,
    variableType: AttributeType.NUMBER,
    ...initialData,
    value: initialData?.value ?? initialValue,
  };
};

export function isValidConnection(potentialConnection: Connection, logic: Logic): boolean {
  const targetOperation = logic.find((op) => op.id === potentialConnection.target);

  const existingConnections = [];
  for (const operation of logic) {
    for (const connection of operation.connections) {
      if (connection.id === potentialConnection.target) {
        existingConnections.push(connection);
      }
    }
  }

  if (potentialConnection.targetHandle?.includes(IOType.Parameter)) {
    for (const existingConnection of existingConnections) {
      if (potentialConnection.targetHandle?.includes(existingConnection.targetType)) {
        return false;
      }
    }
  }

  if (
    targetOperation?.type === OperationType.Return &&
    potentialConnection.targetHandle?.includes('input')
  ) {
    for (const operation of logic) {
      for (const connection of operation.connections) {
        if (connection.id === targetOperation?.id && connection.targetType === IOType.Input) {
          return false;
        }
      }
    }
  }

  if (potentialConnection.targetHandle?.includes(IOType.Condition)) {
    for (const operation of logic) {
      for (const connection of operation.connections) {
        if (connection.id === targetOperation?.id && connection.targetType === IOType.Condition) {
          return false;
        }
      }
    }
  }

  return true;
}
