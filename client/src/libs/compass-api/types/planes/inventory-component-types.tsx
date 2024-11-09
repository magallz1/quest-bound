import { ComponentTypes, SheetComponentType } from './base-component-types';
import { DEFAULT_GRID_SIZE, MAX_SIZE } from './defaults';

export const inventoryComponentTypes: SheetComponentType[] = [
  {
    label: 'Item',
    description: 'Item',
    type: ComponentTypes.ITEM,
    minWidth: DEFAULT_GRID_SIZE,
    minHeight: DEFAULT_GRID_SIZE,
    defaultWidth: 10 * DEFAULT_GRID_SIZE,
    defaultHeight: 10 * DEFAULT_GRID_SIZE,
    maxHeight: MAX_SIZE * DEFAULT_GRID_SIZE,
    maxWidth: MAX_SIZE * DEFAULT_GRID_SIZE,
    defaultRotation: 0,
    defaultLayer: 2,
    transparent: true,
    scalable: true,
  },
];
