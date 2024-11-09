import { addEdge, Connection, Edge } from 'reactflow';
import { IOType, Operation } from '../types';

interface ConnectionProps {
  setEdges: React.Dispatch<React.SetStateAction<Edge<any>[]>>;
  onUpdateOperation: (update: Partial<Operation> & { id: string }) => void;
  onUpdateOperations: (updates: Array<Partial<Operation> & { id: string }>) => void;
  getOperation: (id: string) => Operation | undefined;
}
/**
 * When edges are created or destroyed, updates the the corresponding operations with the operation references.
 */
export const useConnection = ({ setEdges, getOperation, onUpdateOperations }: ConnectionProps) => {
  const onConnect = (connection: Connection) => {
    const sourceOperation = getOperation(connection.source ?? '');

    const sourceConnectionType = (connection.sourceHandle?.replace(`${connection.source}-`, '') ??
      '') as IOType;
    const targetConnectionType = (connection.targetHandle?.replace(`${connection.target}-`, '') ??
      '') as IOType;

    let parameterId: string | undefined = undefined;

    if (targetConnectionType.includes('parameter')) {
      const [_, _parameterId] = targetConnectionType.split(':');
      parameterId = _parameterId;
    }

    const id = `${connection.source}:${sourceConnectionType}=>${connection.target}:${targetConnectionType}`;
    setEdges((eds) =>
      addEdge(
        {
          ...connection,
          id,
          type: 'custom-edge',
          data: {
            targetIOType: targetConnectionType,
            sourceIOType: sourceConnectionType,
            parameterId,
          },
        },
        eds,
      ),
    );

    const existingSourceConnections = sourceOperation?.connections ?? [];

    const sourceUpdate: Partial<Operation> & { id: string } = { id: sourceOperation?.id ?? '' };
    sourceUpdate.connections = [
      ...existingSourceConnections,
      {
        id: connection.target ?? '',
        sourceType: sourceConnectionType,
        targetType: targetConnectionType,
        data: parameterId,
      },
    ];

    onUpdateOperations([sourceUpdate]);
  };

  const onDisconnect = (_changes: Array<any>) => {
    const changes = _changes.filter((change) => change.type === 'remove');

    const updates: Array<Partial<Operation> & { id: string }> = [];

    for (const change of changes) {
      const [sourceIdWithType, targetIdWithType] = change.id.split('=>');
      const [sourceId] = sourceIdWithType.split(':');
      const [targetId, _targetType, _parameterId] = targetIdWithType.split(':');

      const targetType = _targetType.includes('parameter')
        ? `${_targetType}:${_parameterId}`
        : _targetType;

      const sourceOperation = getOperation(sourceId);

      const sourceUpdate: Partial<Operation> & { id: string } = { id: sourceId };

      sourceUpdate.connections = sourceOperation?.connections.filter((con) => {
        if (con.id !== targetId) return true;
        return con.targetType !== targetType;
      });

      updates.push(sourceUpdate);
    }

    onUpdateOperations(updates);
  };

  return {
    onConnect,
    onDisconnect,
  };
};
