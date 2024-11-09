import { ComponentTypes, ConnectionData, SheetComponentType } from './base-component-types';
import { DEFAULT_GRID_SIZE, MAX_SIZE } from './defaults';

export const manageComponentTypes: SheetComponentType[] = [
  {
    label: 'Archetype',
    description: 'Creates a new character archetype.',
    type: ComponentTypes.ARCHETYPE,
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
  {
    label: 'Creature',
    description: 'Creates a new creature archetype.',
    type: ComponentTypes.CREATURE,
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

export type ArchetypeComponentData = ConnectionData & {
  archetypeId: string;
};
