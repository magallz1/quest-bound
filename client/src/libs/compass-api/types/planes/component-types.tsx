import { baseComponentTypes, SheetComponentType } from './base-component-types';
import { inventoryComponentTypes } from './inventory-component-types';
import { logicComponentTypes } from './logic-component-types';
import { manageComponentTypes } from './manage-component-types';

export const componentTypes: SheetComponentType[] = [
  ...baseComponentTypes,
  ...logicComponentTypes,
  ...manageComponentTypes,
  ...inventoryComponentTypes,
];
