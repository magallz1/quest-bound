import { SheetComponent, SheetTab, UpdateComponentsInput, useGetSheet } from '@/libs/compass-api';
import { useEffect, useRef } from 'react';
import { Node } from 'reactflow';
import { PlaneEditorType } from '../../types';
import { useEditorStore } from '../editor-store';
import { editorEmitter } from '../utils';
import { useNavigateTabs } from './use-navigate-tabs';
import { useSheetCrud } from './use-sheet-crud';

interface Props {
  sheetId: string;
  components: SheetComponent[];
  nodes: Node[];
  cacheOnly?: boolean;
  viewMode: boolean;
  streamMode: boolean;
  editorType: PlaneEditorType;
}

export const useHydrateEditorStore = ({
  sheetId,
  components,
  nodes,
  cacheOnly = false,
  viewMode,
  streamMode,
  editorType,
}: Props) => {
  const { sheet } = useGetSheet(sheetId);
  const _sheetTabs = JSON.parse(sheet?.tabs ?? '[]') as SheetTab[];
  const { activeTab } = useNavigateTabs(_sheetTabs);

  const {
    setComponents,
    setSheetId,
    setViewMode,
    viewMode: _viewMode,
    streamMode: _streamMode,
    sheetId: _sheetId,
    editorType: _editorType,
    setSelectedComponentIds,
    selectedComponentIds,
    setUpdateComponent,
    setUpdateComponents,
    setCreateComponents,
    setEditorType,
    setCacheOnly,
  } = useEditorStore();

  useEffect(() => {
    if (sheetId !== _sheetId) setSheetId(sheetId);
    if (viewMode !== _viewMode) setViewMode(viewMode);
    if (streamMode !== _streamMode) setViewMode(streamMode);
    if (editorType !== _editorType) setEditorType(editorType);
    if (cacheOnly !== cacheOnly) setCacheOnly(cacheOnly);
  }, [sheetId, viewMode, cacheOnly, streamMode, editorType]);

  // CRUD
  const onUpdate = ({ updates }: UpdateComponentsInput) => {
    const prevMap = useEditorStore.getState().componentMap;

    for (const update of updates) {
      const prev = JSON.parse(prevMap.get(update.id) ?? '{}');

      prevMap.set(
        update.id,
        JSON.stringify({
          ...prev,
          ...update,
          data: JSON.stringify({
            ...JSON.parse(prev.data ?? '{}'),
            ...JSON.parse(update.data ?? '{}'),
          }),
          style: JSON.stringify({
            ...JSON.parse(prev.style ?? '{}'),
            ...JSON.parse(update.style ?? '{}'),
          }),
        }),
      );
    }

    useEditorStore.setState({ componentMap: new Map(prevMap) });
    for (const update of updates) {
      editorEmitter.emit(`component-${update.id}-update`, update);
    }
  };

  const { updateComponent, updateComponents, createComponents } = useSheetCrud({
    sheetId,
    cacheOnly,
    onUpdateComponents: onUpdate,
  });

  useEffect(() => {
    setUpdateComponent(updateComponent);
    setUpdateComponents(updateComponents);
    setCreateComponents(createComponents);
  }, [cacheOnly, sheetId]);

  /////////////

  // Components
  const prevComponentLength = useRef(0);
  const prevTabId = useRef('');
  useEffect(() => {
    if (components.length !== prevComponentLength.current || prevTabId.current !== activeTab) {
      const newMap = new Map();

      for (const component of components) {
        newMap.set(component.id, JSON.stringify(component));
      }

      useEditorStore.setState({ componentMap: newMap });

      prevComponentLength.current = components.length;
      prevTabId.current = activeTab;
    }

    // Components are used for components that need other components, like line segments.
    // This won't cause a re-render of components that read from the component map (i.e. getComponent).
    setComponents(components);
  }, [components, activeTab]);

  useEffect(() => {
    const selectedNodes = new Set(nodes.filter((node) => node.selected).map((n) => n.id));
    const selectedComponents = components.filter((component) => selectedNodes.has(component.id));
    const newSelectedComponentIds = selectedComponents.map((c) => c.id);
    if (JSON.stringify(newSelectedComponentIds) === JSON.stringify(selectedComponentIds)) return;
    // TODO: This causes nodes to re-render.
    setSelectedComponentIds(newSelectedComponentIds);
  }, [nodes]);

  //////////////
};
