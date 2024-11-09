import { useMemo } from 'react';
import { TreeItem } from '../types';
import { flattenTree, removeChildrenOf } from '../utils';

interface UseFlattenedItems {
  activeId: string | null;
  items: TreeItem[];
}

export const useFlattenedItems = ({ activeId, items }: UseFlattenedItems) => {
  const flattenedItems = useMemo(() => {
    const flattenedTree = flattenTree(items);

    const collapsedItems = flattenedTree.reduce<string[]>(
      (acc, { children, collapsed, id }) => (collapsed && children.length ? [...acc, id] : acc),
      [],
    );

    return removeChildrenOf(
      flattenedTree,
      activeId ? [activeId, ...collapsedItems] : collapsedItems,
    );
  }, [activeId, items]);

  return flattenedItems;
};
