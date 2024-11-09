// Partial structure of tree models such as Page and Image
type TreeItem = {
  id: string;
  parentId?: string | null;
  sortIndex?: number | null;
};

/**
 * Takes a tree structure along with an updated tree item.
 *
 * Returns the item and its siblings with updated sort indicies.
 */
export function sortTreeItemSiblings(items: TreeItem[], updatedItem: TreeItem): TreeItem[] {
  const siblings = [
    ...items.filter((item) => item.parentId === updatedItem.parentId || item.id === updatedItem.id),
  ];

  siblings.sort((a, b) => (a.sortIndex ?? 0) - (b.sortIndex ?? 0));

  const newIndex = updatedItem.sortIndex ?? 0;
  const currentItem = siblings.find((item) => item.id === updatedItem.id) ?? {};
  const currentIndex = siblings.findIndex((item) => item.id === updatedItem.id);

  if (currentIndex !== -1) {
    siblings.splice(currentIndex, 1);
    siblings.splice(newIndex, 0, {
      ...currentItem,
      ...updatedItem,
    });
  }

  const updatedSiblings = siblings.map((item, index) => ({
    ...item,
    sortIndex: index,
  }));

  return updatedSiblings;
}
