import { AttributeType, ContextualAttribute, ContextualItem, useCharts } from '@/libs/compass-api';
import { Logic, Operation, OperationType } from '@/libs/compass-planes';
import { emitter } from '@/libs/compass-web-utils';
import { LogType, useEventLog } from '@/stores';
import debounce from 'lodash.debounce';
import { useEffect, useRef } from 'react';
import { clampValueToAttributeMinMax, useEvaluateLogic } from './evaluation';
import { UpdateCharacterAttributeProps } from './types';

const MAX_REP = 1000;
const TIME_LIMIT_SECONDS = 1.5;

interface UseSubscribeAttributeChangesProps {
  contextualAttributes: ContextualAttribute[];
  items: ContextualItem[];
  loading: boolean;
  updateCharacterAttribute: (props: UpdateCharacterAttributeProps) => void;
  disableLogic: () => void;
  skip?: boolean;
}

/**
 * Subscribes each attribute to events emitted by changes in its dependents.
 * Calls updateCharacterAttribute with a new value evaluated from logic.
 */
export const useSubscribeAttributeChanges = ({
  contextualAttributes,
  items,
  loading,
  updateCharacterAttribute,
  disableLogic,
  skip,
}: UseSubscribeAttributeChangesProps) => {
  const { logEvent } = useEventLog();
  const { charts } = useCharts(undefined, skip);

  const { deriveLogicResult } = useEvaluateLogic({
    charts,
    attributes: contextualAttributes,
    items,
  });

  const evaluationReps = useRef<number>(0);
  const clearRep = debounce(() => {
    evaluationReps.current = 0;
  }, TIME_LIMIT_SECONDS * 1000);

  const countRep = () => {
    evaluationReps.current += 1;
    if (evaluationReps.current > MAX_REP) {
      emitter.removeAllListeners();
      disableLogic();
      logEvent({
        type: LogType.ERROR,
        message: `More than ${MAX_REP} operations occured within ${TIME_LIMIT_SECONDS} seconds. There is likely a circular dependency in your game logic.`,
      });
    }
    clearRep();
  };

  useEffect(() => {
    if (skip) return;
    if (!contextualAttributes.length || loading) return;

    // Actions do not subscribe to change events because they are manually triggered by players only
    const primitiveAttributes = contextualAttributes.filter(
      (attr) => attr.type !== AttributeType.ACTION,
    );

    emitter.removeAllListeners();

    for (const attribute of primitiveAttributes) {
      attribute.dependencies.forEach((dependency) => {
        // Subscribe to changes in the dependency
        emitter.on(
          `attribute:${dependency.id}:change`,
          (
            providedAttributeData: ContextualAttribute[],
            providedCharacterId,
            providedCharts,
            providedItems: ContextualItem[],
          ) => {
            countRep();
            const affectedAttribute = providedAttributeData.find(
              (attr) => attr.id === attribute.id,
            );

            const logicDisabled = providedAttributeData?.find(
              (attr) => attr.id === attribute.id,
            )?.logicDisabled;

            // Disabled logic means this attribute is manually controlled until re-enabled
            if (logicDisabled || !affectedAttribute) return;

            const logicWithInjectedAttributeValues: Logic = affectedAttribute.logic.map(
              (op: Operation) => {
                const attribute = providedAttributeData.find((attr) => {
                  if (attr.id === op.attributeRef) return true;
                  if (op.type === OperationType.GetItem) {
                    const id = `${op.attributeRef}-${op.data.selectedPropertyId}`;
                    return id === attr.id;
                  }
                });

                if (!attribute) return op;
                return {
                  ...op,
                  value: attribute.value,
                };
              },
            );

            const updatedLogicalData = deriveLogicResult(
              logicWithInjectedAttributeValues,
              providedAttributeData,
              providedItems,
            );

            const clampedValue = clampValueToAttributeMinMax(
              affectedAttribute.value,
              logicWithInjectedAttributeValues,
            );

            if (clampedValue === updatedLogicalData) return;

            updateCharacterAttribute({
              id: attribute.id,
              value: updatedLogicalData ?? clampedValue ?? attribute.value,
              providedAttributeData,
              providedCharacterId,
              providedCharts,
              manualChange: false,
              logType: LogType.LOGIC,
            });
          },
        );
      });
    }
  }, [JSON.stringify(contextualAttributes), loading, skip]);
};
