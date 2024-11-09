import { IOType, Logic, LogicalValue, Operation, OperationType } from '@/libs/compass-planes';
import { getAllOperationsConnectedToInput } from './utils';

export function evaluateMathOperation(
  operation: Operation,
  logic: Logic,
  operator: OperationType,
): LogicalValue {
  const connectedOperations = getAllOperationsConnectedToInput(operation, logic);

  let ableToCompute = true;

  const values = connectedOperations.map((op) => {
    if (op.value === undefined || op.value === null || op.value === '') return 0;
    if (isNaN(parseFloat(`${op.value}`))) {
      ableToCompute = false;
    }
    return parseFloat(`${op.value}`);
  });

  if (!ableToCompute) {
    if (operator !== OperationType.Add) return 'Error';
    let concatenatedString = '';
    for (const value of connectedOperations.map((op) => op.value)) {
      concatenatedString += value;
    }
    return concatenatedString;
  }

  const operatorFn = (() => {
    switch (operator) {
      case OperationType.Add:
        return (acc: number, val: number) => acc + val;

      case OperationType.Subtract:
        return (acc: number, val: number) => acc - val;

      case OperationType.Multiply:
        return (acc: number, val: number) => acc * val;

      case OperationType.Divide:
        return (acc: number, val: number) => acc / val;

      default:
        return () => 0;
    }
  })();

  return values.slice(1).reduce(operatorFn, values[0]);
}

export function evaluateRoundingOperation(operation: Operation, logic: Logic): LogicalValue {
  const connectedOperations = getAllOperationsConnectedToInput(operation, logic);

  const averageValue =
    connectedOperations.length === 0
      ? 0
      : connectedOperations.reduce((acc, op) => acc + parseFloat(`${op.value}`), 0) /
        connectedOperations.length;

  if (isNaN(averageValue)) return 'Error';

  switch (operation.type) {
    case OperationType.Round:
      return Math.round(parseFloat(`${averageValue}`)).toString();
    case OperationType.RoundDown:
      return Math.floor(parseFloat(`${averageValue}`)).toString();
    case OperationType.RoundUp:
      return Math.ceil(parseFloat(`${averageValue}`)).toString();
  }

  return 0;
}

export function evaluateExponentOperation(operation: Operation, logic: Logic): LogicalValue {
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

  // Exponent
  if (operation.type === OperationType.Exponent) {
    if (parameterA === undefined || parameterB === undefined) return '';
    return Math.pow(parseFloat(`${parameterA}`), parseFloat(`${parameterB}`)).toString();
  }

  // Logarithm
  if (parameterA === undefined) {
    return '';
  }

  // Return natural logarithm
  if (!parameterB) {
    return Math.log(parseFloat(`${parameterA}`));
  }

  // Return logarithm with base
  return Math.log(parseFloat(`${parameterA}`)) / Math.log(parseFloat(`${parameterB}`));
}
