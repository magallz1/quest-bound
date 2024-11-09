import {
  AttributeContext,
  ComponentTypes,
  Sheet,
  SheetTab,
  useComponents,
} from '@/libs/compass-api';
import { Stack } from '@chakra-ui/react';
import { ReactNode, useContext, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BackgroundVariant, Node, Panel, ReactFlowProps } from 'reactflow';
import { contextOptions, convertItemToNode, sheetNodeTypes } from '../common';
import { BaseEditor, EditorLoading } from '../common/components';
import { EditBar } from '../common/components/edit-bar';
import {
  useCopyPaste,
  useMoveNodes,
  useSheetComponentNodes,
  useSyncComponentsWithNodes,
} from '../common/hooks';
import { PlaneEditorType } from '../types';
import { TabsRow } from './components';

interface SheetEditorProps {
  sheet?: Sheet;
  viewMode: boolean;
  characterId?: string;
  streamMode?: boolean;
  cacheOnly?: boolean;
  title?: ReactNode;
  controls?: ReactNode;
  type?: PlaneEditorType;
  excludeComponentTypes?: ComponentTypes[];
  overrideActiveTab?: string;
  reactFlowProps?: ReactFlowProps;
  loading?: boolean;
  disableSelection?: boolean;
}

export const SheetEditor = ({
  sheet,
  viewMode,
  streamMode = false,
  title,
  controls,
  cacheOnly = false,
  characterId,
  type = PlaneEditorType.SHEET,
  excludeComponentTypes = [],
  overrideActiveTab,
  reactFlowProps,
  loading: loadingOverride,
  disableSelection,
}: SheetEditorProps) => {
  const { items, updateItemsPositions } = useContext(AttributeContext);
  const tabs = JSON.parse(sheet?.tabs || '[]') as SheetTab[];
  const sheetDetails = JSON.parse(sheet?.details ?? '{}');
  const [disableKeyEvents, setDisableKeyEvents] = useState(false);

  const backgroundVariant =
    sheetDetails.renderGrid === 'square' ? BackgroundVariant.Lines : BackgroundVariant.Dots;

  const [searchParams] = useSearchParams();
  const tabId = overrideActiveTab ?? searchParams.get('tab') ?? tabs[0]?.tabId;

  const overrideComponents = sheet?.components ?? null;
  const { components: fetchedComponents, loading: componentsLoading } = useComponents(
    sheet?.id,
    false,
    tabId,
  );
  const components = overrideComponents ?? fetchedComponents;

  const loading = loadingOverride || (!overrideComponents && componentsLoading);

  const pastedIds = useRef(new Set<string>());

  const [nodes, setNodes] = useState<Node[]>([]);

  useSheetComponentNodes({
    components,
    additionalNodes: items
      .map((item) => convertItemToNode(item, components))
      .filter(Boolean) as Node[],
    viewMode,
    setNodes,
    pastedIds: pastedIds.current,
    loading,
    tabId,
  });

  const { createSheetComponent, deleteSheetComponents, updateSheetComponents } =
    useSyncComponentsWithNodes({
      sheetId: sheet?.id ?? '',
      tabId,
      components,
      setNodes,
    });

  useCopyPaste({
    nodes,
    components,
    pastedIds: pastedIds.current,
    tabId,
    disabled: disableKeyEvents || disableSelection,
    onCut: (components) => deleteSheetComponents(components.map((comp) => comp.id)),
    onPaste: (components) =>
      components.forEach((component) =>
        createSheetComponent(
          component.type as ComponentTypes,
          { x: component.x, y: component.y },
          1,
          component,
        ),
      ),
  });

  const getComponent = (id: string) => components.find((comp) => comp.id === id);

  const onChange = (
    nodeUpdateMap: Map<string, { x: number; y: number; height: number; width: number }>,
  ) => {
    const componentNodesToUpdate = [];
    const itemsToUpdate = [];

    for (const id of nodeUpdateMap.keys()) {
      const comp = getComponent(id);
      const item = items.find((i) => i.instanceId === id);
      if (comp) {
        componentNodesToUpdate.push({
          id,
          x: nodeUpdateMap.get(id)!.x,
          y: nodeUpdateMap.get(id)!.y,
          height: nodeUpdateMap.get(id)!.height,
          width: nodeUpdateMap.get(id)!.width,
        });
      } else if (item) {
        const inventory = components.find((i) => i.id === item.data.parentId);
        if (nodeUpdateMap.has(inventory?.id ?? '')) continue;

        const x = nodeUpdateMap.get(id)!.x - (inventory?.x ?? 0);
        const y = nodeUpdateMap.get(id)!.y - (inventory?.y ?? 0);

        if (isNaN(x) || isNaN(y)) continue;

        itemsToUpdate.push({
          id,
          x,
          y,
          height: item.data.height,
          width: item.data.width,
        });
      }
    }

    if (componentNodesToUpdate.length > 0) {
      updateSheetComponents(
        componentNodesToUpdate.map((node) => ({
          id: node.id,
          coordinates: { x: node.x, y: node.y },
          height: node.height,
          width: node.width,
        })),
      );
    }

    if (itemsToUpdate.length > 0) {
      updateItemsPositions(
        itemsToUpdate.map((item) => ({
          id: item.id,
          x: item.x,
          y: item.y,
        })),
      );
    }
  };

  const onMoveOrDelete = useMoveNodes({
    onDeleteNodes: deleteSheetComponents,
    setNodes,
    onChange,
    getComponent,
    items,
  });

  if (loading) {
    return <EditorLoading />;
  }

  return (
    <Stack height={streamMode ? 'calc(100vh - 60px)' : 'calc(100dvh - 60px)'}>
      <BaseEditor
        id='sheet-editor'
        cacheOnly={cacheOnly}
        backgroundImageSrc={sheet?.backgroundImage?.src ?? undefined}
        backgroundSize={sheetDetails.backgroundImgSize}
        backgroundOpacity={sheetDetails.backgroundImgOpacity}
        disableKeyEvents={disableKeyEvents}
        setDisableKeyEvents={setDisableKeyEvents}
        type={type}
        sheetId={sheet?.id ?? ''}
        viewMode={viewMode}
        streamMode={streamMode}
        components={components}
        onSelectFromMenu={createSheetComponent}
        onDelete={deleteSheetComponents}
        menuOptions={contextOptions.filter((opt) => !excludeComponentTypes.includes(opt.nodeType))}
        nodeTypes={sheetNodeTypes}
        backgroundVariant={backgroundVariant}
        nodes={nodes}
        snapGrid={[20, 20]}
        snapToGrid={sheetDetails.snapToGrid}
        onNodesChange={onMoveOrDelete}
        renderControls={!viewMode}
        renderBackground={!viewMode && !!sheetDetails.renderGrid}
        nodesDraggable={!viewMode}
        elementsSelectable={!viewMode && !disableSelection}
        deleteKeyCode={viewMode || disableSelection ? null : 'Backspace'}
        renderContextMenu={!viewMode}
        nodesConnectable={false}
        setNodes={setNodes}
        nodeExtent={[
          [0, 0],
          [Infinity, Infinity],
        ]}
        translateExtent={[
          [0, 0],
          [Infinity, Infinity],
        ]}
        {...reactFlowProps}
        topLeftPanel={<EditBar type={type} />}
        topRightPanel={
          <Stack direction='row' spacing={2} align='center'>
            {title && title}
            {controls && controls}
          </Stack>
        }>
        <Panel position='bottom-center'>
          {type === PlaneEditorType.SHEET && <TabsRow sheet={sheet} viewMode={viewMode} />}
        </Panel>
      </BaseEditor>
    </Stack>
  );
};
