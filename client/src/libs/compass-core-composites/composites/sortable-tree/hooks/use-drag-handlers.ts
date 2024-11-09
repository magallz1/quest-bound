import { DragEndEvent, DragMoveEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { FlattenedItem, TreeItem } from '../types';
import { buildTree, findItemDeep, flattenTree } from '../utils';
import { useFlattenedItems } from './use-flattened-items';

type Projection = {
  depth: number;
  maxDepth: number;
  minDepth: number;
  parentId: string | null;
};

interface UseDragHandlers {
  activeId: string | null;
  items: TreeItem[];
  projected: Projection | null;
  restrictNestingToDirectory?: boolean;
  setActiveId: (id: string | null) => void;
  setOverId: (id: string | null) => void;
  setCurrentPosition: (position: { parentId: string | null; overId: string } | null) => void;
  setOffsetLeft: (offset: number) => void;
  setItems: (items: TreeItem[]) => void;
  onDrop?: (pageId: string, parentId: string | null, sortedChildIds: string[]) => Promise<boolean>;
}

export const useDragHandlers = ({
  activeId,
  items,
  projected,
  restrictNestingToDirectory,
  setActiveId,
  setOverId,
  setCurrentPosition,
  setOffsetLeft,
  setItems,
  onDrop,
}: UseDragHandlers) => {
  const flattenedItems = useFlattenedItems({ activeId: activeId as string, items });

  function resetState() {
    setOverId(null);
    setActiveId(null);
    setOffsetLeft(0);
    setCurrentPosition(null);

    document.body.style.setProperty('cursor', '');
  }

  function onDragStart({ active: { id: activeId } }: DragStartEvent) {
    setActiveId(activeId as string);
    setOverId(activeId as string);

    const activeItem = flattenedItems.find(({ id }) => id === activeId);

    if (activeItem) {
      setCurrentPosition({
        parentId: activeItem.parentId,
        overId: activeId as string,
      });
    }

    document.body.style.setProperty('cursor', 'grabbing');
  }

  function onDragMove({ delta }: DragMoveEvent) {
    setOffsetLeft(delta.x);
  }

  function onDragOver({ over }: DragOverEvent) {
    setOverId((over?.id as string) ?? null);
  }

  async function onDragEnd({ active, over }: DragEndEvent) {
    resetState();

    if (projected && over) {
      const snapshot = [...items];

      const { depth, parentId } = projected;
      const parentIdTyped = projected.parentId ? (projected.parentId as string) : null;

      const clonedItems: FlattenedItem[] = JSON.parse(JSON.stringify(flattenTree(items)));
      const overIndex = clonedItems.findIndex(({ id }) => id === over.id);
      const activeIndex = clonedItems.findIndex(({ id }) => id === active.id);
      const activeTreeItem = clonedItems[activeIndex];

      const projectParentItem = clonedItems.find(({ id }) => id === parentIdTyped);

      if (restrictNestingToDirectory && projectParentItem?.leaf) {
        return;
      }

      clonedItems[activeIndex] = { ...activeTreeItem, depth, parentId };

      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
      const newItems = buildTree(sortedItems);

      setItems(newItems);

      // Find dropped page and it's parent
      const parent = findItemDeep(newItems, parentId || '');

      const siblings = parent?.children
        ? parent.children.map((treeItem) => treeItem.id)
        : newItems.map((treeItem) => treeItem.id);

      // Dropped item's position among siblings
      const newIndex = Math.max(siblings.indexOf(active.id as string), 0);

      // sort child ID array
      const newSortedChildIds = insertPageAt(siblings as string[], active.id.toString(), newIndex);

      // Reset items if onDrop callback returns false
      if (!!onDrop) {
        const pageUpdateSuccessful = await onDrop?.(
          active.id as string,
          parentIdTyped,
          newSortedChildIds,
        );

        if (!pageUpdateSuccessful) {
          setItems(snapshot);
        }
      }
    }
  }

  function onDragCancel() {
    resetState();
  }

  return {
    onDragStart,
    onDragMove,
    onDragOver,
    onDragEnd,
    onDragCancel,
  };
};

function insertPageAt(childIds: string[], newChildId: string, index: number) {
  const pageOrder = childIds.filter((id) => id !== newChildId);

  if (index >= 0) {
    pageOrder.splice(index, 0, newChildId);
  }

  return [...new Set(pageOrder)];
}
