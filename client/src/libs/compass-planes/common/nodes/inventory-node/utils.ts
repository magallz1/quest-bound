import { ContextualItem, SheetComponent } from '@/libs/compass-api';
import { Coordinates } from '@/libs/compass-planes';

export function getNewItemCoords(
  item: ContextualItem,
  inventory: SheetComponent,
  existingItems: ContextualItem[],
): (Coordinates & { rotated: boolean }) | null {
  const itemWidth = item.data.width * 20;
  const itemHeight = item.data.height * 20;

  const occupiedSpaces = existingItems.map((existingItem) => {
    const relativeX = existingItem.data.x ?? 0;
    const relativeY = existingItem.data.y ?? 0;
    return {
      x: relativeX,
      y: relativeY,
      width: (existingItem.data.width ?? 1) * 20,
      height: (existingItem.data.height ?? 1) * 20,
    };
  });

  let rotated = false;

  const getUnoccupiedSpace = (height: number, width: number) => {
    for (let y = 0; y <= inventory.height - height; y++) {
      for (let x = 0; x <= inventory.width - width; x++) {
        const spaceOccupied = occupiedSpaces.some(
          (space) =>
            x < space.x + space.width &&
            x + width > space.x &&
            y < space.y + space.height &&
            y + height > space.y,
        );

        if (!spaceOccupied) {
          return { x, y, rotated };
        }
      }
    }

    return null;
  };

  return getUnoccupiedSpace(itemHeight, itemWidth);
  // TODO: Implement rotation
  // if (unoccupiedSpace) return unoccupiedSpace;

  // rotated = true;
  // const unoccupiedSpaceRotated = getUnoccupiedSpace(itemWidth, itemHeight);
  // return unoccupiedSpaceRotated;
}
