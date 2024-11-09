import debounce from 'lodash.debounce';
import { useMemo, useRef } from 'react';
import { Operation } from '../types';

interface UseUpdateOperationCoordinatesProps {
  logic: Operation[];
  onChange: (logic: Operation[]) => void;
}

export const useUpdateOperationCoordinates = ({
  logic,
  onChange,
}: UseUpdateOperationCoordinatesProps) => {
  // Sync coordinates with operation in logic
  const operationUpdateMap = useRef<Map<string, Partial<Operation>>>(new Map());
  const debouncedNodeUpdate = useMemo(
    () =>
      debounce(() => {
        onChange(
          logic.map((operation) => {
            if (!operationUpdateMap.current.has(operation.id)) return operation;
            return { ...operation, ...operationUpdateMap.current.get(operation.id) };
          }),
        );

        operationUpdateMap.current = new Map();
      }, 500),
    [logic],
  );

  return {
    updateOperationCoords: debouncedNodeUpdate,
    operationUpdateMap,
  };
};
