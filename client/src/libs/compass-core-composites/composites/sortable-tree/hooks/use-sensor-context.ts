import { KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useEffect, useRef, useState } from 'react';
import { sortableTreeKeyboardCoordinates } from '../keyboard-coordinates';
import { SensorContext, TreeItem } from '../types';
import { useFlattenedItems } from './use-flattened-items';

interface UseSensorContext {
  activeId: string | null;
  items: TreeItem[];
  offsetLeft: number;
  indentationWidth: number;
  indicator: boolean;
}

export const useSensorContext = ({
  activeId,
  items,
  offsetLeft,
  indentationWidth,
  indicator,
}: UseSensorContext) => {
  const flattenedItems = useFlattenedItems({ activeId, items });

  const sensorContext: SensorContext = useRef({
    items: flattenedItems,
    offset: offsetLeft,
  });

  const [coordinateGetter] = useState(() =>
    sortableTreeKeyboardCoordinates(sensorContext, indicator, indentationWidth),
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter,
      keyboardCodes: {
        start: [''],
        end: [''],
        cancel: ['Escape'],
      },
    }),
  );

  useEffect(() => {
    sensorContext.current = {
      items: flattenedItems,
      offset: offsetLeft,
    };
  }, [flattenedItems, offsetLeft]);

  return sensors;
};
