import { Announcements, closestCenter, DndContext, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React, { CSSProperties, ReactNode, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  dropAnimationConfig,
  getAnnouncements,
  getMovementAnnouncementFn,
  measuring,
} from './configs';
import { useDragHandlers } from './hooks/use-drag-handlers';
import { useFlattenedItems } from './hooks/use-flattened-items';
import { useSensorContext } from './hooks/use-sensor-context';
import { SortableTreeItem } from './sortable-tree-item';
import type { TreeItem } from './types';
import { adjustTranslate, getChildCount, getProjection, setProperty } from './utils';

interface Props {
  items: TreeItem[];
  setItems: React.Dispatch<React.SetStateAction<TreeItem[]>>;
  dragHandle?: boolean;
  dragHandleStyle?: React.CSSProperties;
  collapsible?: boolean;
  indentationWidth?: number;
  indicator?: boolean;
  dirIcon?: ReactNode;
  selectedId?: string | null;
  selectedStyle?: any;
  hoveredId?: string | null;
  hoveredStyle?: CSSProperties;
  disabled?: boolean;
  readOnly?: boolean;
  /**
   * Only allows nested a tree item under another one when the parent's leaf property is false
   */
  restrictNestingToDirectory?: boolean;
  onSelect?: (id: string) => void;
  onRemove?: (id: string) => void;
  onUpdateName?: (name: string) => void;
  onDrop?: (id: string, parentId: string | null, sortedChildIds: string[]) => Promise<boolean>;
  onCollapse?: (id: string) => void;
}

export function SortableTree({
  items,
  collapsible = true,
  dragHandle = false,
  dragHandleStyle,
  indicator = false,
  indentationWidth = 25,
  dirIcon,
  selectedId,
  selectedStyle,
  hoveredId,
  hoveredStyle,
  disabled,
  readOnly = false,
  restrictNestingToDirectory = false,
  onRemove,
  setItems,
  onSelect,
  onDrop,
  onUpdateName,
  onCollapse,
}: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const [currentPosition, setCurrentPosition] = useState<{
    parentId: string | null;
    overId: string;
  } | null>(null);

  const flattenedItems = useFlattenedItems({ activeId, items });

  const projected =
    activeId && overId
      ? getProjection(flattenedItems, activeId, overId, offsetLeft, indentationWidth)
      : null;

  const dragHandlers = useDragHandlers({
    restrictNestingToDirectory,
    activeId,
    items,
    projected,
    setActiveId,
    setOverId,
    setCurrentPosition,
    setOffsetLeft,
    setItems,
    onDrop,
  });

  const sensors = useSensorContext({
    activeId,
    items,
    offsetLeft,
    indentationWidth,
    indicator,
  });

  const getMovementAnnouncement = getMovementAnnouncementFn({
    items,
    projected,
    currentPosition,
    setCurrentPosition,
  });

  const announcements: Announcements = getAnnouncements(getMovementAnnouncement);

  const sortedIds = useMemo(() => flattenedItems.map(({ id }) => id), [flattenedItems]);
  const activeItem = activeId ? flattenedItems.find(({ id }) => id === activeId) : null;

  function handleRemove(id: string) {
    onRemove?.(id);
  }

  function handleCollapse(id: string) {
    onCollapse?.(id);
    setItems((items) =>
      setProperty(items, id, 'collapsed', (value) => {
        return !value;
      }),
    );
  }

  return (
    <DndContext
      accessibility={{ announcements }}
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={measuring}
      {...dragHandlers}>
      <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
        {flattenedItems.map(
          ({ id, label, children, collapsed, depth, hidden, leaf }) =>
            !hidden && (
              <SortableTreeItem
                id={id}
                hoveredStyle={id === hoveredId ? hoveredStyle : {}}
                readOnly={readOnly}
                disabled={disabled || readOnly}
                dragHandle={dragHandle}
                dragHandleStyle={dragHandleStyle}
                dirIcon={dirIcon}
                key={id}
                value={label}
                leaf={leaf}
                selected={id === selectedId}
                depth={id === activeId && projected ? projected.depth : depth}
                indentationWidth={indentationWidth}
                indicator={indicator}
                collapsed={Boolean(collapsed && children.length)}
                onSelect={onSelect}
                selectedStyle={selectedStyle}
                onUpdateName={onUpdateName}
                onCollapse={collapsible && children.length ? () => handleCollapse(id) : undefined}
                onRemove={!!onRemove ? () => handleRemove(id) : undefined}
              />
            ),
        )}
        {createPortal(
          <DragOverlay
            dropAnimation={dropAnimationConfig}
            modifiers={indicator ? [adjustTranslate] : undefined}>
            {activeId && activeItem && !activeItem.hidden ? (
              <SortableTreeItem
                id={activeId}
                dirIcon={dirIcon}
                depth={activeItem.depth}
                clone
                childCount={getChildCount(items, activeId)}
                value={activeItem.label}
                indentationWidth={indentationWidth}
              />
            ) : null}
          </DragOverlay>,
          document.body,
        )}
      </SortableContext>
    </DndContext>
  );
}
