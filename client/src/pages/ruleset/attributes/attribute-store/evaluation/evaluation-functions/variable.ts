import { Logic, Operation, OperationType } from '@/libs/compass-planes';
import { getAllOperationsConnectedToInput } from './utils';

export function evaluateVariableOperation(
  operation: Operation,
  logic: Logic,
  shouldUseTestValue = true,
): any {
  const connectedOperations = getAllOperationsConnectedToInput(operation, logic);

  const otherVariables = logic.filter(
    (op) => op.id !== operation.id && op.type === OperationType.Variable && !!op.variableName,
  );

  if (connectedOperations.length === 0) {
    const existingVariable = otherVariables.find((op) => {
      return (
        op.variableName === operation.variableName &&
        op.value !== undefined &&
        op.value !== null &&
        op.value !== ''
      );
    });

    // When a variable has the same name as another variable which has a value
    const hasValue =
      existingVariable?.value !== undefined &&
      existingVariable?.value !== null &&
      existingVariable?.value !== '';

    // When a variable within an action (parameter) has a value passed from a calling attribute
    const hasParameterValue =
      operation?.data?.parameterValue !== undefined &&
      operation?.data?.parameterValue !== null &&
      operation?.data?.parameterValue !== '';

    // When a variable has a given test value
    const hasTestvalue =
      shouldUseTestValue &&
      operation?.data?.testValue !== undefined &&
      operation?.data?.testValue !== null &&
      operation?.data?.testValue !== '';

    return hasValue
      ? existingVariable.value
      : hasParameterValue
        ? operation.data.parameterValue
        : hasTestvalue
          ? operation.data.testValue
          : '';
  }

  return connectedOperations[0]?.value;
}
