import { ComponentTypes, SheetComponent } from '@/libs/compass-api';
import { useDeviceSize } from '@/libs/compass-core-ui';
import { useKeyListeners } from '@/libs/compass-web-utils';
import { Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  ConnectionLineType,
  Controls,
  Node,
  Panel,
  ReactFlowProps,
} from 'reactflow';
import { PlaneEditorType } from '../../types';
import { useHydrateEditorStore } from '../hooks';
import { EditorMenuOption } from '../nodes';
import { RenderLineShapes } from '../nodes/line-node/render-line-shapes';
import { ContextMenu } from './context-menu';
import { TabletEditPanel } from './edit-bar/tablet-edit-panel';

interface BaseEditorProps extends ReactFlowProps {
  id?: string;
  sheetId: string;
  backgroundImageSrc?: string;
  backgroundSize?: 'cover' | 'contain';
  backgroundOpacity?: number;
  components: SheetComponent[];
  cacheOnly?: boolean;
  type: PlaneEditorType;
  topLeftPanel?: React.ReactNode;
  menuOptions: EditorMenuOption[];
  onSelectFromMenu: (
    nodeType: ComponentTypes,
    coordinates: { x: number; y: number },
    zoom: number,
  ) => void;
  onDelete: (ids: string[]) => void;
  onCloseMenu?: () => void;
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  backgroundVariant?: BackgroundVariant;
  renderControls?: boolean;
  renderBackground?: boolean;
  renderContextMenu?: boolean;
  disableEditing?: boolean;
  topRightPanel?: React.ReactNode;
  viewMode: boolean;
  streamMode?: boolean;
  disableKeyEvents: boolean;
  setDisableKeyEvents: (disable: boolean) => void;
}

export const BaseEditor = ({
  id,
  sheetId,
  backgroundImageSrc,
  backgroundSize = 'cover',
  backgroundOpacity = 1,
  components,
  cacheOnly,
  type,
  streamMode = false,
  topLeftPanel,
  menuOptions,
  onSelectFromMenu,
  onCloseMenu,
  onDelete,
  nodes,
  setNodes,
  backgroundVariant,
  viewMode,
  renderControls = true,
  renderBackground = true,
  renderContextMenu = true,
  disableEditing = false,
  topRightPanel,
  disableKeyEvents,
  setDisableKeyEvents,
  ...props
}: BaseEditorProps) => {
  const { desktop } = useDeviceSize();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  useHydrateEditorStore({
    sheetId,
    components,
    viewMode,
    streamMode,
    cacheOnly,
    nodes,
    editorType: type,
  });

  useKeyListeners({
    onKeyDown: (e) => {
      if (e.key === 'Enter' && e.shift) {
        setContextMenu({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        });
      } else if (!!contextMenu && e.key === 'Escape') {
        setContextMenu(null);
      }
    },
  });

  return (
    <section
      id={id}
      style={{ height: '100%', width: '100%' }}
      onContextMenu={(e) => {
        if (!renderContextMenu) return;
        e.preventDefault();
        setContextMenu({
          x: e.clientX,
          y: e.clientY,
        });
        return false;
      }}>
      <ReactFlow
        nodes={nodes}
        key={viewMode.toString()}
        connectionLineType={ConnectionLineType.SmoothStep}
        selectionOnDrag={true}
        snapGrid={[1, 1]}
        snapToGrid
        nodeDragThreshold={1}
        zoomOnDoubleClick={false}
        onlyRenderVisibleElements
        multiSelectionKeyCode={'Shift'}
        minZoom={0.2}
        panOnScroll
        // fitView={viewMode}
        selectNodesOnDrag={false}
        {...props}>
        {!!backgroundImageSrc && (
          <Background
            id='bg-image'
            gap={20}
            size={0.1}
            style={{
              opacity: backgroundOpacity,
              backgroundRepeat: 'no-repeat',
              backgroundSize: backgroundSize,
              backgroundImage: `url(${backgroundImageSrc})`,
            }}
          />
        )}

        {renderBackground && (
          <Background
            id='bg-grid'
            variant={backgroundVariant ?? BackgroundVariant.Dots}
            gap={20}
            size={1}
            style={{
              opacity: backgroundVariant === BackgroundVariant.Lines ? 0.1 : 1,
            }}
          />
        )}

        {renderControls && <Controls position='bottom-right' />}

        <Panel position='top-left'>
          {topLeftPanel}
          {!components.length && desktop && !viewMode && (
            <Text fontStyle='italic' fontSize='0.9rem' style={{ userSelect: 'none' }}>
              Right click to place components
            </Text>
          )}
        </Panel>

        <TabletEditPanel setContextMenu={setContextMenu} onDelete={onDelete} viewMode={viewMode}>
          {topRightPanel}
        </TabletEditPanel>

        {renderContextMenu && (
          <ContextMenu
            isOpen={!!contextMenu}
            options={menuOptions}
            onSelect={onSelectFromMenu}
            onClose={() => {
              onCloseMenu?.();
              setContextMenu(null);
            }}
            x={contextMenu?.x ?? 0}
            y={contextMenu?.y ?? 0}
          />
        )}
        {props.children}
        <RenderLineShapes components={components} />
      </ReactFlow>
    </section>
  );
};
