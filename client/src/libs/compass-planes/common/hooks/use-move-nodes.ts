import { ComponentTypes, ContextualItem, SheetComponent } from '@/libs/compass-api';
import { useRef } from 'react';
import { applyNodeChanges, Node } from 'reactflow';

interface UseMoveNodesProps {
  getComponent: (id: string) => SheetComponent | undefined;
  onDeleteNodes: (ids: string[]) => void;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  items: ContextualItem[];
  onChange: (
    nodeUpdateMap: Map<string, { x: number; y: number; height: number; width: number }>,
  ) => void;
}

/**
 * Hooks into ReactFlow node move and resize events and fires callbacks with a memoized map of changes.
 */
export const useMoveNodes = ({
  onChange,
  setNodes,
  onDeleteNodes,
  getComponent,
  items,
}: UseMoveNodesProps) => {
  const nodeUpdateMap = useRef<
    Map<string, { x: number; y: number; height: number; width: number }>
  >(new Map());

  const onNodesChange = (_changes: Array<any>) => {
    const changes = _changes.filter((change: any) => {
      const component = getComponent(change.id);

      // Ignore locked nodes
      if (change.type === 'remove' && component?.locked) return false;

      // Component has not changed
      if (change.type === 'dimensions') {
        if (
          change.dimensions?.width === component?.width &&
          change.dimensions?.height === component?.height
        ) {
          return false;
        }
      }

      // For additional nodes (like archetypes), there won't be a component
      if (!component) return true;
      return component;
    });

    const toRemove = changes.filter((change: any) => change.type === 'remove');
    const toUpdate = changes.filter((change: any) => change.type !== 'remove');

    if (toRemove.length > 0) {
      onDeleteNodes(toRemove.map((change: any) => change.id));
    }

    let positionsChanged = false;
    const subFlowChanges: any[] = [];

    for (const change of toUpdate) {
      if (!change.position && !change.dimensions) continue;
      positionsChanged = true;

      // Set relative position for items
      const component = getComponent(change.id);

      if (component?.type === ComponentTypes.INVENTORY && change.type === 'position') {
        const deltaX = change.position.x - component.x;
        const deltaY = change.position.y - component.y;

        const itemsToUpdate = items.filter((item) => item.data.parentId === component.id);
        for (const item of itemsToUpdate) {
          nodeUpdateMap.current.set(item.instanceId, {
            x: (item.data.x ?? 0) + deltaX,
            y: (item.data.y ?? 0) + deltaY,
            height: item.data.height,
            width: item.data.width,
          });
          subFlowChanges.push({
            type: 'position',
            id: item.instanceId,
            position: {
              x: (item.data.x ?? 0) + component.x + deltaX,
              y: (item.data.y ?? 0) + component.y + deltaY,
            },
          });
        }
      }

      nodeUpdateMap.current.set(change.id, {
        ...nodeUpdateMap.current.get(change.id),
        ...change.position,
        ...change.dimensions,
      });
    }

    if (changes.length > 0) {
      const newSelectionSet = new Set<string>(
        changes
          .filter((change: any) => change.type === 'select' && change.selected)
          .map((change: any) => change.id),
      );

      setNodes((nodes) => {
        const changesWithGroupSelect = [...changes, ...subFlowChanges];

        // Select all nodes that are grouped with any selected nodes
        for (const node of nodes) {
          const thisComponent = getComponent(node.id);

          const nodesInGroup = nodes.filter((n) => {
            const component = getComponent(n.id);
            return !!component?.groupId && component?.groupId === thisComponent?.groupId;
          });

          if (nodesInGroup.some((n) => newSelectionSet.has(n.id))) {
            changesWithGroupSelect.push({
              id: node.id,
              type: 'select',
              selected: true,
            });
          }
        }

        return applyNodeChanges(changesWithGroupSelect, nodes);
      });
    }

    if (positionsChanged) {
      onChange(nodeUpdateMap.current);
      nodeUpdateMap.current = new Map();
    }
  };

  return onNodesChange;
};
