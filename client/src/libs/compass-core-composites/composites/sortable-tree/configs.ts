import {
  Announcements,
  defaultDropAnimation,
  DropAnimation,
  MeasuringStrategy,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FlattenedItem, TreeItem } from './types';
import { flattenTree } from './utils';

export const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
};

export const dropAnimationConfig: DropAnimation = {
  keyframes({ transform }) {
    return [
      { opacity: 1, transform: CSS.Transform.toString(transform.initial) },
      {
        opacity: 0,
        transform: CSS.Transform.toString({
          ...transform.final,
          x: transform.final.x + 5,
          y: transform.final.y + 5,
        }),
      },
    ];
  },
  easing: 'ease-out',
  sideEffects({ active }) {
    active.node.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: defaultDropAnimation.duration,
      easing: defaultDropAnimation.easing,
    });
  },
};

export const getAnnouncements = (
  getMovementAnnouncement: (eventName: string, activeId: string, overId?: string) => string,
): Announcements => ({
  onDragStart({ active }) {
    return `Picked up ${active.id}.`;
  },
  onDragMove({ active, over }) {
    return getMovementAnnouncement('onDragMove', active.id as string, over?.id as string);
  },
  onDragOver({ active, over }) {
    return getMovementAnnouncement('onDragOver', active.id as string, over?.id as string);
  },
  onDragEnd({ active, over }) {
    return getMovementAnnouncement('onDragEnd', active.id as string, over?.id as string);
  },
  onDragCancel({ active }) {
    return `Moving was cancelled. ${active.id} was dropped in its original position.`;
  },
});

interface GetMovementAnnouncementFn {
  items: TreeItem[];
  projected?: {
    depth: number;
    maxDepth: number;
    minDepth: number;
    parentId: string | null;
  } | null;
  currentPosition?: { parentId: string | null; overId: string } | null;
  setCurrentPosition?: (position: { parentId: string | null; overId: string }) => void;
}

export function getMovementAnnouncementFn({
  items,
  projected,
  currentPosition,
  setCurrentPosition,
}: GetMovementAnnouncementFn) {
  return (eventName: string, activeId: string, overId?: string) => {
    if (overId && projected) {
      if (eventName !== 'onDragEnd') {
        if (
          currentPosition &&
          projected.parentId === currentPosition.parentId &&
          overId === currentPosition.overId
        ) {
          return '';
        } else {
          setCurrentPosition?.({
            parentId: projected.parentId,
            overId,
          });
        }
      }

      const clonedItems: FlattenedItem[] = JSON.parse(JSON.stringify(flattenTree(items)));
      const overIndex = clonedItems.findIndex(({ id }) => id === overId);
      const activeIndex = clonedItems.findIndex(({ id }) => id === activeId);
      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);

      const previousItem = sortedItems[overIndex - 1];

      let announcement;
      const movedVerb = eventName === 'onDragEnd' ? 'dropped' : 'moved';
      const nestedVerb = eventName === 'onDragEnd' ? 'dropped' : 'nested';

      if (!previousItem) {
        const nextItem = sortedItems[overIndex + 1];
        announcement = `${activeId} was ${movedVerb} before ${nextItem.id}.`;
      } else {
        if (projected.depth > previousItem.depth) {
          announcement = `${activeId} was ${nestedVerb} under ${previousItem.id}.`;
        } else {
          let previousSibling: FlattenedItem | undefined = previousItem;
          while (previousSibling && projected.depth < previousSibling.depth) {
            const parentId: string | null = previousSibling.parentId;
            previousSibling = sortedItems.find(({ id }) => id === parentId);
          }

          if (previousSibling) {
            announcement = `${activeId} was ${movedVerb} after ${previousSibling?.id}.`;
          }
        }
      }

      return announcement ?? '';
    }
    return '';
  };
}
