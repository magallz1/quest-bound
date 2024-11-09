import { Transform } from '@dnd-kit/utilities';

export const blockPlaneEventsClassNames = ['block-plane-events'];

export type { Transform };

export enum PlaneEditorType {
  EMPTY,
  SHEET,
  PAGE,
  JOURNAL,
  LOGIC,
  MANAGE,
  STREAM,
  INVENTORY,
}

export type Coordinates = {
  x: number;
  y: number;
};

export type Size = {
  height: number;
  width: number;
};

export type DraggableNode = {
  /**
   * X coordinate relative to its container
   */
  x: number;
  /**
   * Y coordinate relative to its container
   */
  y: number;
  /**
   * Height in pixels
   */
  height: number;
  /**
   * Width in pixels
   */
  width: number;
  id: string;
  containerId?: string;
};

export type DropEvent = {
  droppableContainerId: string | null;
  draggableId: string | null;
  relativeStartPosition: Coordinates;
  relativeDroppedPosition: Coordinates;

  /**
   * Delta captured by calculating the mouse position from the bounding rect of the parent container
   */
  delta: Coordinates;

  /**
   * Delta captured by the drag sensor
   */
  rawDelta: Coordinates;
};

export type DragEvent = {
  draggableId: string | null;
};

export type MoveEvent = {
  delta: Coordinates;
};
