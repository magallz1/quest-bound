import { SheetComponent } from '@/libs/compass-api';
import { useNodes } from 'reactflow';

export const useSelections = (components: SheetComponent[]) => {
  const nodes = useNodes();
  const selectedNodes = nodes.filter((node) => node.selected);

  return {
    selectedComponents: components.filter((c) => selectedNodes.some((n) => n.id === c.id)),
  };
};
