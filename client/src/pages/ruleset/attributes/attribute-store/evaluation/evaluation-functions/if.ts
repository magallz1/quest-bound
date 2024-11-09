import { IOType, Logic, Operation } from '@/libs/compass-planes';
import { getUpstreamConnectionsOfType } from './utils';

/**
 * Returns the next set of connections given the result of the if operation's condition.
 */
export function evaluateIfOperation(operation: Operation, logic: Logic): string[] {
  const conditionalResult = ifConditionPassed(operation, logic);

  const connectionsIfTrue: string[] = [];
  const connectionsIfFalse: string[] = [];

  for (const connection of operation.connections) {
    if (connection.sourceType === IOType.OutputIfTrue) {
      connectionsIfTrue.push(connection.id);
    } else if (connection.sourceType === IOType.OutputIfFalse) {
      connectionsIfFalse.push(connection.id);
    }
  }

  const nextConnections = conditionalResult ? connectionsIfTrue : connectionsIfFalse;

  return nextConnections;
}

export function ifConditionPassed(operation: Operation, logic: Logic) {
  const conditionalOperations = getUpstreamConnectionsOfType(operation, logic, IOType.Condition);
  return conditionalOperations[0]?.value === 'true';
}
