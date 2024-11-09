import { SheetComponent } from '@/libs/compass-api';
import { useEffect, useMemo, useRef } from 'react';
import { Node } from 'reactflow';
import { convertSheetComponentToNode } from '../utils';

interface UseSheetComponentNodesProps {
  components: SheetComponent[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  additionalNodes?: Node[];
  viewMode: boolean;
  pastedIds: Set<string>;
  loading: boolean;
  tabId: string;
}

/**
 * When nodes are updated in a controlled pattern, this hook syncs those updates with components
 */
export const useSheetComponentNodes = ({
  components,
  loading,
  tabId,
  setNodes,
  viewMode,
  pastedIds,
  additionalNodes = [],
}: UseSheetComponentNodesProps) => {
  const bootstrapped = useRef(false);
  const prevTab = useRef<string | null>(null);
  const prevNumComponents = useRef<number>(components.length);
  const sumOfAllLayers = useMemo(() => {
    return components.reduce((acc, component) => acc + component.layer, 0);
  }, [components]);

  // Initial bootstrap
  useEffect(() => {
    if (prevTab.current !== tabId) bootstrapped.current = false;
    if (loading || bootstrapped.current) return;
    prevTab.current = tabId;

    setNodes([
      ...components.map((c) => convertSheetComponentToNode(c, viewMode)),
      ...additionalNodes,
    ]);
    bootstrapped.current = true;
  }, [components, loading, tabId]);

  // New component from context menu
  useEffect(() => {
    setNodes([
      ...components.map((c) => convertSheetComponentToNode(c, viewMode)),
      ...additionalNodes,
    ]);
  }, [components.length, JSON.stringify(additionalNodes)]);

  // Deselect on view mode
  useEffect(() => {
    if (viewMode) {
      setNodes((prev) =>
        prev.map((n) => ({
          ...n,
          selected: false,
        })),
      );
    }
  }, [viewMode]);

  // Component layers have changed
  useEffect(() => {
    if (prevNumComponents.current !== components.length) {
      prevNumComponents.current = components.length;
      return;
    }
    setNodes((prev) => {
      const selectedSet = new Set(prev.filter((n) => n.selected).map((n) => n.id));
      return [
        ...components
          .map((c) => ({ ...c, selected: selectedSet.has(c.id) }))
          .map((c) =>
            convertSheetComponentToNode({
              ...c,
              selected: selectedSet.has(c.id),
            }),
          ),
        ...additionalNodes,
      ];
    });
  }, [sumOfAllLayers]);

  // New components pasted from existing
  useEffect(() => {
    if (pastedIds.size === 0) {
      return;
    }
    const newComponents = components.filter((component) => pastedIds.has(component.id));
    setNodes((prev) => [
      ...prev.map((node) => ({
        ...node,
        selected: false,
      })),
      ...newComponents.map((newComponent) => ({
        ...convertSheetComponentToNode({ ...newComponent, selected: true }),
      })),
    ]);
    pastedIds.clear();
  }, [components]);
};
