import {
  EvaluationError,
  EvaluationErrorType,
  Logic,
  LogicalValue,
  Operation,
  OperationType,
} from '@/libs/compass-planes';
import { getAllOperationsConnectedToInput } from './utils';

export function evaluateBooleanComparison(
  operation: Operation,
  logic: Logic,
  type: OperationType,
  onError: (error: EvaluationError) => void,
): LogicalValue {
  const connectedOperations = getAllOperationsConnectedToInput(operation, logic);

  if (connectedOperations.length === 0) {
    return '';
  }

  const allAreBoolean = connectedOperations.every(
    (op) => op.value === 'true' || op.value === 'false',
  );

  if (!allAreBoolean) {
    onError({
      message: 'All inputs must be booleans',
      operationId: operation.id,
      type: EvaluationErrorType.TypeMismatch,
    });

    return '';
  }

  if (type === OperationType.And) {
    return connectedOperations.every((op) => op.value === 'true').toString();
  } else {
    return connectedOperations.some((op) => op.value === 'true').toString();
  }
}
