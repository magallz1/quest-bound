import { IOType, Logic, LogicalValue, Operation, OperationType } from '@/libs/compass-planes';
import { stringIsNumber } from '@/libs/compass-web-utils';

/**
 * Returns an operation's upstream connections.
 *
 * If branches are included upstream, includes only the operations on the current branch.
 */
export function getAllOperationsConnectedToInput(
  operation: Operation,
  logic: Logic,
  stopAtBranch = false,
): Operation[] {
  const connectedOperations: Operation[] = [];

  for (const op of logic.filter((op) => op.id !== operation.id)) {
    // Attach an if's opertions upstream connections if this operation is on the current branch
    if (op.type === OperationType.If && !stopAtBranch) {
      const conditionalConnection = logic.find((o) => {
        return o.connections.find((con) => con.targetType === IOType.Condition && con.id === op.id);
      });

      // Note: Can't call evaluateIfOperation here because it would create a circular dependency

      const conditionPassed = conditionalConnection?.value === 'true';

      const nextConnections = conditionPassed
        ? op.connections.filter((con) => con.sourceType === IOType.OutputIfTrue)
        : op.connections.filter((con) => con.sourceType === IOType.OutputIfFalse);

      if (nextConnections.some((conn) => conn.id === operation.id)) {
        const upstreamIfConnections = getUpstreamConnectionsOfType(op, logic, IOType.Input);
        connectedOperations.push(...upstreamIfConnections);
      }
    } else {
      if (
        op.connections
          .filter(
            (con) =>
              con.sourceType === IOType.Output ||
              con.sourceType === IOType.OutputIfFalse ||
              con.sourceType === IOType.OutputIfTrue,
          )
          .map((o) => o.id)
          .includes(operation.id)
      ) {
        connectedOperations.push(op);
      }
    }
  }

  return sortByEditorVerticalPlacement(connectedOperations);
}

export function getUpstreamConnectionsOfType(
  operation: Operation,
  logic: Logic,
  type: IOType,
  stopAtBranch = false,
): Operation[] {
  const connectedOperations = getAllOperationsConnectedToInput(operation, logic, stopAtBranch);

  return connectedOperations.filter((op) => {
    return op.connections.some((con) => con.targetType === type);
  });
}

export function operationIsOnInactiveBranch(operation: Operation, logic: Logic): boolean {
  const initialUpstreamOperations = getUpstreamConnectionsOfType(
    operation,
    logic,
    IOType.Input,
    true,
  );

  if (!initialUpstreamOperations.length) return false;

  let isOnInActiveBranch = false;

  for (const ifOperation of initialUpstreamOperations.filter(
    (op) => op.type === OperationType.If,
  )) {
    const ifOperationUpstreamConnections = getUpstreamConnectionsOfType(
      ifOperation,
      logic,
      IOType.Input,
    );

    if (ifOperationUpstreamConnections.length === 0) {
      const connectionToThisOperation = ifOperation.connections.find(
        (con) => con.id === operation.id,
      );
      const isOnTrueBranch = connectionToThisOperation?.sourceType === IOType.OutputIfTrue;
      isOnInActiveBranch = isOnTrueBranch
        ? ifOperation.value === 'false'
        : ifOperation.value === 'true';
    }
  }

  return isOnInActiveBranch;
}

/**
 * Returns the value of the first found output operation only if the attached conditional operation is true or not connected.
 */
export function getValueOfInputIfShouldExecute(
  operation: Operation,
  logic: Logic,
  shouldInverse = false,
): LogicalValue {
  const conditionalOperation = logic.find((op) => {
    return op.connections.some(
      (con) => con.targetType === IOType.Execute && con.id.includes(operation.id),
    );
  });

  const outputOperations = getUpstreamConnectionsOfType(
    operation,
    logic,
    IOType.Input,
    true,
  ).filter((op) => op.id !== conditionalOperation?.id);

  if (!conditionalOperation) return outputOperations[0]?.value ?? '';

  const conditionalConnection = conditionalOperation.connections.find(
    (conn) => conn.id === operation.id,
  );
  const returnIfFalse = conditionalConnection?.sourceType === IOType.OutputIfFalse;
  const conditionPassed = shouldInverse
    ? conditionalOperation?.value === 'false'
    : conditionalOperation?.value === 'true';

  if (returnIfFalse) {
    return !conditionPassed ? outputOperations[0]?.value ?? '' : '';
  } else {
    return conditionPassed ? outputOperations[0]?.value ?? '' : '';
  }
}

export function sortOperationByOrderOfExecution(operations: Logic): Logic {
  // Operations which depend on other operations should be executed after the operations they depend on
  // Dependent operations will be listed in their parent's connections array
  const operationMap: Map<string, Operation> = new Map();
  const visited = new Set();
  const stack: Logic = [];

  // Create a map for quick lookup
  operations.forEach((operation) => operationMap.set(operation.id, operation));

  function visit(operation: Operation) {
    if (visited.has(operation.id)) return;
    visited.add(operation.id);

    // Any operation that references this op
    let dependentOperations: Logic = [];
    for (const op of operations) {
      if (operation.type === OperationType.Variable) {
        // find action parameters
        if (op.type === OperationType.Action) {
          dependentOperations.push(op);
        }

        if (op.type === OperationType.Variable) {
          // find other variables
          if (op.variableName === operation.variableName && operation.connections.length === 0) {
            dependentOperations.push(op);
          }
        }
      }

      if (op.type === OperationType.DefaultValue) {
        dependentOperations.push(op);
      }
    }

    for (const downstreamConnection of operation.connections) {
      const downstreamOperation = operationMap.get(downstreamConnection.id);
      if (downstreamOperation?.type === OperationType.If) {
        for (const connection of [
          ...downstreamOperation.connections,
          ...downstreamOperation.connections,
        ]) {
          if (operationMap.has(connection.id)) {
            dependentOperations.push(operationMap.get(connection.id)!);
          }
        }
      }
    }

    // Visit all dependencies first
    [...operation.connections.map((o) => o.id), ...dependentOperations.map((o) => o.id)].forEach(
      (id) => {
        if (operationMap.has(id)) {
          visit(operationMap.get(id)!);
        }
      },
    );

    // Add operation to stack after all its dependencies
    stack.push(operation);
  }

  // Visit all operations
  operations.forEach(visit);

  // Reverse the stack to get the correct execution order
  return stack.reverse();
}

export function sortByEditorVerticalPlacement(operations: Logic): Logic {
  return operations.sort((a, b) => a.y - b.y);
}

export function operationIsComparative(operation: Operation): boolean {
  return (
    operation.type === OperationType.Equal ||
    operation.type === OperationType.NotEqual ||
    operation.type === OperationType.GreaterThan ||
    operation.type === OperationType.GreaterThanOrEqual ||
    operation.type === OperationType.LessThan ||
    operation.type === OperationType.LessThanOrEqual
  );
}

export function getAttributeMinMax(
  logic: Logic,
  valueMap?: Map<string, LogicalValue | null | undefined>,
) {
  let minValue: number | undefined;
  let maxValue: number | undefined;

  const defaultValueOperation = logic.find((op) => op.type === OperationType.DefaultValue);
  if (!defaultValueOperation) return { minValue, maxValue };

  for (const op of logic) {
    for (const connection of op.connections) {
      if (
        connection.id === defaultValueOperation.id &&
        connection.targetType.includes('parameter:a')
      ) {
        const val = valueMap?.get(op.attributeRef ?? '') ?? op.value;
        if (!isNaN(parseFloat(`${val}`))) {
          minValue = parseFloat(`${val}`);
        }
      } else if (
        connection.id === defaultValueOperation.id &&
        connection.targetType.includes('parameter:b')
      ) {
        const val = valueMap?.get(op.attributeRef ?? '') ?? op.value;
        if (!isNaN(parseFloat(`${val}`))) {
          maxValue = parseFloat(`${val}`);
        }
      }
    }
  }

  return {
    minValue,
    maxValue,
  };
}

export function clampValueToAttributeMinMax(
  value: LogicalValue,
  logic: Logic,
  valueMap?: Map<string, LogicalValue | null | undefined>,
) {
  const { minValue, maxValue } = getAttributeMinMax(logic, valueMap);

  if (!stringIsNumber(`${value}`)) return value;

  const numberValue = parseFloat(`${value}`);

  const clampedResult = Math.min(
    Math.max(numberValue, minValue ?? -Infinity),
    maxValue ?? Infinity,
  );

  if (isNaN(clampedResult)) return value;

  return clampedResult;
}
