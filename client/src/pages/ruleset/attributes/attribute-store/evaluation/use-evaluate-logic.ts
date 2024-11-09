import { Attribute, Chart, ContextualAttribute, ContextualItem } from '@/libs/compass-api';
import {
  EvaluationError,
  EvaluationErrorType,
  Logic,
  LogicalValue,
  Operation,
  OperationType,
} from '@/libs/compass-planes';
import { useRef } from 'react';
import { evaluateOperation } from './evaluate-operation';
import {
  injectArgumentsInActionLogic,
  sortOperationByOrderOfExecution,
} from './evaluation-functions';

interface UseEvaluateLogicProps {
  charts: Chart[];
  attributes: Attribute[] | ContextualAttribute[];
  items: ContextualItem[];
  useTestValues?: boolean;
}

function covertContextualAttributesToAttributes(attributes: ContextualAttribute[]): Attribute[] {
  return attributes.map((attr) => {
    return {
      ...attr,
      logic: typeof attr.logic === 'string' ? attr.logic : JSON.stringify(attr.logic),
      dependencies: undefined,
      dependents: undefined,
    };
  }) as unknown as Attribute[];
}

export const useEvaluateLogic = ({
  charts,
  attributes: _attributes,
  items,
  useTestValues = false,
}: UseEvaluateLogicProps) => {
  const operationErrors = useRef<EvaluationError[]>([]);

  const setOperationErrors = (errors: EvaluationError[]) => {
    operationErrors.current = [...operationErrors.current, ...errors];
  };

  function evaluateLogic(
    logic: Logic,
    attributeOverrides?: Attribute[] | ContextualAttribute[],
    providedItems?: ContextualItem[],
    visitedActionIds?: Set<string>,
    providedErrors: EvaluationError[] = [],
    actionResultMap: Map<string, LogicalValue | undefined> = new Map(),
    _shouldUseTestValue = true,
  ) {
    const shouldUseTestValue = useTestValues && _shouldUseTestValue;
    const attributes = covertContextualAttributesToAttributes(
      (attributeOverrides ?? _attributes) as ContextualAttribute[],
    );

    let evaluatedLogic: Logic = [...logic];

    setOperationErrors(providedErrors);

    for (const operation of sortOperationByOrderOfExecution(logic)) {
      let result: LogicalValue | undefined = operation.value;

      if (operation.type === OperationType.Action) {
        if (visitedActionIds?.has(operation.id)) {
          setOperationErrors([
            {
              message: 'Circular dependency detected in action',
              operationId: operation.id,
              attributeRef: operation.attributeRef,
              type: EvaluationErrorType.Circular,
            },
          ]);
        } else {
          const actionAttribute = attributes.find((attr) => attr.id === operation.attributeRef);
          if (!actionAttribute) continue;

          const furtherActions: Logic = JSON.parse(actionAttribute.logic ?? '[]').filter(
            (op: Operation) => op.type === OperationType.Action,
          );

          visitedActionIds = visitedActionIds ?? new Set<string>();
          visitedActionIds.add(operation.id);

          // Evaluate the logic of every action in this attribute, passing the result recursively
          // When it bubbles up to this action, assign the result to the operation and move on
          for (const furtherAction of [...furtherActions, operation]) {
            const furtherActionAttribute = attributes.find(
              (attr) => attr.id === furtherAction.attributeRef,
            );

            if (!furtherActionAttribute) continue;

            if (actionResultMap.has(furtherAction.id)) {
              continue;
            }

            // Inject this attribute's variables, then recursively evaluate the logic of the action
            const _actionLogicWithInjectedParameters = injectArgumentsInActionLogic(
              evaluatedLogic,
              JSON.parse(furtherActionAttribute.logic ?? '[]'),
            );

            const actionLogicWithInjectedParameters = _actionLogicWithInjectedParameters.map(
              (op) => {
                if (!actionResultMap?.has(op.id)) {
                  return op;
                }
                return {
                  ...op,
                  value: actionResultMap.get(op.id),
                };
              },
            );

            const { evaluatedLogic: evaluatedActionLogic, errors: prevErrors } = evaluateLogic(
              actionLogicWithInjectedParameters,
              undefined,
              providedItems ?? items,
              visitedActionIds,
              operationErrors.current,
              actionResultMap,
              false,
            );

            setOperationErrors(prevErrors);

            const returnOperations = evaluatedActionLogic
              .filter((op) => op.type === OperationType.Return)
              .filter((op) => op.value !== undefined && op.value !== '')
              .sort((a, b) => a.y - b.y);

            const actionResult = returnOperations[0]?.value;

            if (actionResult) {
              actionResultMap = actionResultMap ?? new Map<string, LogicalValue>();
              actionResultMap.set(furtherAction.id, actionResult);
            }

            // This action
            if (furtherAction.id === operation.id) {
              result = actionResult;
            }
          }
        }
      } else {
        result = evaluateOperation(
          operation.id,
          evaluatedLogic,
          setOperationErrors,
          shouldUseTestValue,
          providedItems ?? items,
          charts,
          () => {},
        );
      }

      // replace the operation with the evaluated result
      evaluatedLogic = evaluatedLogic.map((op) => {
        if (op.id !== operation.id) return op;
        return {
          ...op,
          value: result,
        };
      });
    }

    const resultErrors = [...operationErrors.current];
    operationErrors.current = [];

    return { evaluatedLogic: evaluatedLogic, errors: resultErrors };
  }

  function deriveLogicResult(
    logic: Logic,
    attributeOverrides?: Attribute[] | ContextualAttribute[],
    providedItems?: ContextualItem[],
  ) {
    const { evaluatedLogic } = evaluateLogic(logic, attributeOverrides, providedItems ?? items);

    const returnOperations = evaluatedLogic
      .filter((op) => op.type === OperationType.Return)
      .filter((op) => op.value !== undefined && op.value !== '')
      .sort((a, b) => a.y - b.y);

    return returnOperations[0]?.value;
  }

  return {
    evaluateLogic,
    deriveLogicResult,
  };
};
