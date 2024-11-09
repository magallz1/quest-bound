import type { MutableRefObject } from 'react';

export interface TreeItem {
  id: string;
  label: string;
  children: TreeItem[];
  collapsed?: boolean;
  hidden?: boolean;
  leaf?: boolean;
}

export interface FlattenedItem extends TreeItem {
  parentId: string | null;
  depth: number;
  index: number;
}

export type SensorContext = MutableRefObject<{
  items: FlattenedItem[];
  offset: number;
}>;
