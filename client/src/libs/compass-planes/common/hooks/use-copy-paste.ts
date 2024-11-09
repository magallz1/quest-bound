import { SheetComponent } from '@/libs/compass-api';
import { generateId, useKeyListeners } from '@/libs/compass-web-utils';
import { useRef } from 'react';
import { Node } from 'reactflow';

interface UseCopyPasteProps {
  nodes: Node[];
  components: SheetComponent[];
  onPaste: (components: SheetComponent[]) => void;
  onCut: (components: SheetComponent[]) => void;
  pastedIds: Set<string>;
  tabId?: string;
  disabled?: boolean;
}

export const useCopyPaste = ({
  nodes,
  components,
  onPaste,
  onCut,
  pastedIds,
  tabId,
  disabled,
}: UseCopyPasteProps) => {
  const selectedNodes = nodes.filter((node) => node.selected);
  const copied = useRef<SheetComponent[]>([]);

  const copy = (shouldCut?: boolean) => {
    const selectedComponents = components.filter((component) =>
      selectedNodes.some((node) => node.id === component.id),
    );
    copied.current = selectedComponents;
    if (shouldCut) {
      onCut(selectedComponents);
    }
  };

  const paste = () => {
    const idMap = new Map<string, string>();
    const groupIdMap = new Map<string, string>();

    copied.current.forEach((component) => {
      idMap.set(component.id, generateId());
      if (component.groupId) {
        groupIdMap.set(component.groupId, generateId());
      }
    });

    const copiedComponents = copied.current.map((component) => {
      return {
        ...component,
        id: idMap.get(component.id) ?? '',
        x: component.x + 100,
        y: component.y + 100,
        tabId: tabId ?? component.tabId,
        groupId: component.groupId ? groupIdMap.get(component.groupId) : null,
      };
    });

    for (const copiedComponent of copiedComponents) {
      pastedIds.add(copiedComponent.id);
    }

    onPaste(copiedComponents);
  };

  useKeyListeners({
    disabled,
    onKeyDown: (e) => {
      if (e.key === 'c' && (e.meta || e.control)) {
        copy();
      } else if (e.key === 'x' && (e.meta || e.control)) {
        copy(true);
      } else if (e.key === 'v' && (e.meta || e.control)) {
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
