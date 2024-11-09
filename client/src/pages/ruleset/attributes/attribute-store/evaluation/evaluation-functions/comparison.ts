import { IOType, Logic, LogicalValue, Operation, OperationType } from '@/libs/compass-planes';
import { getAllOperationsConnectedToInput } from './utils';

export function evaluateComparisonOperation(
  operation: Operation,
  logic: Logic,
  operator: OperationType,
): LogicalValue {
  const connectedOperations = getAllOperationsConnectedToInput(operation, logic);

  let parameterA: LogicalValue | undefined;
  let parameterB: LogicalValue | undefined;

  for (const operation of connectedOperations) {
    for (const connection of operation.connections) {
      if (connection.targetType.includes(IOType.Parameter) && connection.data === 'a') {
        parameterA = operation.value;
      } else if (connection.targetType.includes(IOType.Parameter) && connection.data === 'b') {
        parameterB = operation.value;
      }
    }
  }

  if (parameterA === undefined || parameterB === undefined) return '';

  const operatorFn = (() => {
    switch (operator) {
      case OperationType.Equal:
        return (a: string, b: string) => a == b;

      case OperationType.NotEqual:
        return (a: string, b: string) => a != b;

      case OperationType.GreaterThan:
        return (a: string, b: string) => parseFloat(a) > parseFloat(b);

      case OperationType.LessThan:
        return (a: string, b: string) => parseFloat(a) < parseFloat(b);

      case OperationType.GreaterThanOrEqual:
        return (a: string, b: string) => parseFloat(a) >= parseFloat(b);

      case OperationType.LessThanOrEqual:
        return (a: string, b: string) => parseFloat(a) <= parseFloat(b);

      default:
        return () => false;
    }
  })();

  return operatorFn(`${parameterA}`, `${parameterB}`).toString();
}
