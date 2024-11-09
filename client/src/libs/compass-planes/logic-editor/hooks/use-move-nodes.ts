import { applyNodeChanges, Node } from 'reactflow';
import { Logic, Operation } from '../types';
import { useFilterChanges } from './use-filter-changes';
import { useUpdateOperationCoordinates } from './use-update-operation-coordinates';

interface UseMoveNodesProps {
  logic: Logic;
  getOperation: (id: string) => Operation | undefined;
  onChange: (logic: Logic) => void;
  onDeleteOperations: (ids: string[]) => void;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
}

export const useMoveNodes = ({
  logic,
  setNodes,
  getOperation,
  onChange,
  onDeleteOperations,
}: UseMoveNodesProps) => {
  const { filterChanges } = useFilterChanges(getOperation);
  const { updateOperationCoords, operationUpdateMap } = useUpdateOperationCoordinates({
    logic,
    onChange,
  });

  const onNodesChange = (_changes: Array<any>) => {
    const changes = filterChanges(_changes);

    const toRemove = changes.filter((change: any) => change.type === 'remove');
    const toUpdate = changes.filter((change: any) => change.type !== 'remove');

    if (toRemove.length > 0) {
      onDeleteOperations(toRemove.map((change: any) => change.id));
    }

    let positionsChanged = false;
    for (const change of toUpdate) {
      if (!change.position) continue;
      positionsChanged = true;
      operationUpdateMap.current.set(change.id, change.position);
    }

    if (changes.length > 0) {
      setNodes((nds) => applyNodeChanges(changes, nds));
    }

    if (positionsChanged) {
      updateOperationCoords();
    }
  };

  return onNodesChange;
};
