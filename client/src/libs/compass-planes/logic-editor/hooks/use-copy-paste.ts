import { generateId, useKeyListeners } from '@/libs/compass-web-utils';
import React, { useRef } from 'react';
import { Edge, Node } from 'reactflow';
import { buildEdgesFromLogic, buildNodeFromOperation } from '../build-utils';
import { Logic, Operation } from '../types';

interface UseCopyPasteProps {
  nodes: Node[];
  logic: Logic;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onCreate: (operations: Logic) => void;
}

export const useCopyPaste = ({ nodes, logic, onCreate, setNodes, setEdges }: UseCopyPasteProps) => {
  const selectedNodes = nodes.filter((node) => node.selected);
  const copied = useRef<Operation[]>([]);

  const copy = () => {
    const selectedOperations = logic.filter((operation) =>
      selectedNodes.some((node) => node.id === operation.id),
    );
    copied.current = selectedOperations;
  };

  const paste = () => {
    const idMap = new Map<string, string>();

    copied.current.forEach((operation) => {
      idMap.set(operation.id, generateId());
    });

    const copiedOperations = copied.current.map((operation) => {
      return {
        ...operation,
        id: idMap.get(operation.id) ?? '',
        x: operation.x + 100,
        y: operation.y + 100,
        connections: operation.connections.map((connection) => ({
          ...connection,
          id: idMap.get(connection.id) || connection.id,
        })),
      };
    });

    onCreate(copiedOperations);
    setNodes((prev) => [
      ...prev.map((node) => ({
        ...node,
        selected: false,
      })),
      ...copiedOperations.map((newOperation) => ({
        ...buildNodeFromOperation(newOperation),
        selected: true,
      })),
    ]);
    setEdges(buildEdgesFromLogic([...logic, ...copiedOperations]));
  };

  useKeyListeners({
    onKeyDown: (e) => {
      if (e.key === 'c' && e.meta) {
        copy();
      }

      if (e.key === 'v' && e.meta) {
        paste();
      }
    },
  });

  const duplicate = () => {
    copy();
    paste();
  };

  return {
    copy,
    paste,
    duplicate,
  };
};
