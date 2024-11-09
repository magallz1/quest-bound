import {
  EvaluationError,
  EvaluationErrorType,
  Logic,
  Operation,
  OperationType,
} from '@/libs/compass-planes';
import { getAllOperationsConnectedToInput } from './utils';

export function evaluateNotOperation(
  operation: Operation,
  logic: Logic,
  onError: (error: EvaluationError) => void,
) {
  const connectedOperations = getAllOperationsConnectedToInput(operation, logic);

  if (connectedOperations.length === 0) return '';

  if (connectedOperations.length > 1) {
    onError({
      message: 'Not operations may only have one input',
      operationId: operation.id,
      type: EvaluationErrorType.IncorrectNumberOfArguments,
    });

    return '';
  }

  if (
    ![
      OperationType.Boolean,
      OperationType.And,
      OperationType.Or,
      OperationType.Not,
      OperationType.Attribute,
    ].includes(connectedOperations[0].type)
  ) {
    onError({
      message: 'Must receive a boolean input',
      operationId: operation.id,
      type: EvaluationErrorType.TypeMismatch,
    });
    return '';
  }

  const value = connectedOperations[0]?.value;

  if (value === 'true') return 'false';
  if (value === 'false') return 'true';

  return '';
}
