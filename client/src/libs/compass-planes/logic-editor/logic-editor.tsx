import { Attribute, ContextualItem, CreateAttribute } from '@/libs/compass-api';
import { useKeyListeners } from '@/libs/compass-web-utils';
import { ReactNode, useEffect, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  ConnectionLineType,
  Controls,
  Node,
  Panel,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Coordinates } from '../types';
import {
  bootstrapOperation,
  buildEdgesFromLogic,
  buildNodeFromOperation,
  isValidConnection,
} from './build-utils';
import { EditorControls } from './components';
import { ContextMenu } from './components/context-menu';
import { useMoveNodes } from './hooks';
import { useConnection } from './hooks/use-connection';
import { useCopyPaste } from './hooks/use-copy-paste';
import './logic-editor.css';
import { nodeTypes } from './node-data';
import { edgeTypes } from './node-data/edge-types';
import { LogicProvider } from './provider';
import { EvaluationError, Logic, Operation, OperationType } from './types';

interface LogicEditorProps {
  logic: Logic;
  attribute?: Attribute | null;
  editControls?: ReactNode;
  errors?: EvaluationError[];
  onCloseEditor: () => void;
  onChange: (logic: Logic) => void;
  onCreate: (logic: Logic) => void;
  getOperation: (id: string) => Operation | undefined;
  promoteToAttribute: (
    operation: Operation,
    details: Omit<CreateAttribute, 'rulesetId'>,
  ) => Promise<string>;
  getAttribute: (id?: string | null) => Attribute | undefined;
  getItem: (id?: string | null) => ContextualItem | undefined;
  onUpdateOperations: (updates: Array<Partial<Operation> & { id: string }>) => void;
  onUpdateOperation: (update: Partial<Operation> & { id: string }) => void;
  onDeleteOperations: (ids: string[]) => void;
  overrideOperation: (override: { id: string; value: string }) => void;
}

export const LogicEditor = ({
  attribute,
  logic,
  errors = [],
  editControls,
  getOperation,
  getAttribute,
  getItem,
  promoteToAttribute,
  onChange,
  onCreate,
  onUpdateOperation,
  onUpdateOperations,
  onDeleteOperations,
  overrideOperation,
  onCloseEditor,
}: LogicEditorProps) => {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [nodes, setNodes] = useState<Node[]>(logic.map(buildNodeFromOperation));
  const [edges, setEdges, onEdgesChange] = useEdgesState(buildEdgesFromLogic(logic));

  const [snapToGrid, setSnapToGrid] = useState(true);
  const [showResultsOnNodes, setShowResultsOnNodes] = useState(false);

  const { duplicate } = useCopyPaste({
    nodes,
    logic,
    setNodes,
    setEdges,
    onCreate,
  });

  const operationTypeMap = useRef(new Map<string, OperationType>());

  useEffect(() => {
    // Occurs when logic is reset
    if (logic.length === 0) {
      setEdges([]);
    }

    if (operationTypeMap.current.size === 0 && logic.length > 0) {
      for (const operation of logic) {
        operationTypeMap.current.set(operation.id, operation.type);
      }
    } else {
      for (const operation of logic) {
        if (!operationTypeMap.current.has(operation.id)) continue;
        if (operation.type !== operationTypeMap.current.get(operation.id)) {
          operationTypeMap.current.set(operation.id, operation.type);
          setNodes(logic.map(buildNodeFromOperation));
        }
      }
    }
  }, [logic]);

  const onMove = useMoveNodes({
    logic,
    onChange,
    onDeleteOperations,
    setNodes,
    getOperation,
  });

  const { onConnect, onDisconnect } = useConnection({
    setEdges,
    onUpdateOperation,
    onUpdateOperations,
    getOperation,
  });

  const updateOperation = (update: Partial<Operation> & { id: string }) => {
    onUpdateOperation(update);
  };

  useKeyListeners({
    onKeyDown: (e) => {
      if (e.key === 'Enter' && e.shift) {
        setContextMenu({
          x: window.innerWidth / 2 - 150,
          y: window.innerHeight / 2 - 185,
        });
      }
    },
  });

  const addOperation = (
    type: OperationType,
    coordinates: Coordinates,
    initialData?: Partial<Operation>,
  ) => {
    const newOperation = bootstrapOperation(type, coordinates, initialData);
    operationTypeMap.current.set(newOperation.id, type);
    onCreate([newOperation]);
    setNodes((prev) => [...prev, buildNodeFromOperation(newOperation)]);
  };

  return (
    <LogicProvider
      value={{
        attribute,
        errors,
        evaluatedLogic: logic,
        promoteToAttribute,
        updateOperation,
        addOperation,
        getOperation,
        getAttribute,
        getItem,
        overrideOperation,
        showResultsOnNodes,
      }}>
      <section
        id='logic-editor'
        style={{ height: '100%', width: '100%' }}
        onContextMenu={(e) => {
          e.preventDefault();
          setContextMenu({
            x: e.clientX,
            y: e.clientY,
          });
          return false;
        }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          connectionLineType={ConnectionLineType.Step}
          isValidConnection={(connection) => isValidConnection(connection, logic)}
          selectionOnDrag={true}
          multiSelectionKeyCode={'Shift'}
          panOnScroll
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          snapGrid={[25, 25]}
          snapToGrid={snapToGrid}
          onConnect={onConnect}
          onNodesChange={onMove}
          onEdgesChange={(params: any) => {
            onEdgesChange(params);
            onDisconnect(params);
          }}>
          <Background variant={BackgroundVariant.Dots} gap={25} size={1} />
          <Controls position='bottom-right' />
          {!!editControls && <Panel position='top-right'>{editControls}</Panel>}
          <EditorControls
            {...{
              attributeName: attribute?.name ?? '',
              onCloseEditor,
              snapToGrid,
              setShowResultsOnNodes,
              showResultsOnNodes,
              setSnapToGrid,
              duplicate,
              onDelete: onDeleteOperations,
              onOpenMenu: () => {
                setContextMenu({
                  x: 25,
                  y: 150,
                });
              },
            }}
          />
          <ContextMenu
            isOpen={!!contextMenu}
            onClose={() => setContextMenu(null)}
            x={contextMenu?.x ?? 0}
            y={contextMenu?.y ?? 0}
          />
        </ReactFlow>
      </section>
    </LogicProvider>
  );
};
