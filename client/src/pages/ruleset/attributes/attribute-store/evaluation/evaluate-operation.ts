import { Chart, ContextualItem } from '@/libs/compass-api';
import {
  EvaluationError,
  Logic,
  LogicalValue,
  Operation,
  OperationType,
} from '@/libs/compass-planes';
import { EventLog } from '@/stores';
import {
  evaluateBooleanComparison,
  evaluateChartOperation,
  evaluateComparisonOperation,
  evaluateDiceOperation,
  evaluateExponentOperation,
  evaluateMathOperation,
  evaluateNotOperation,
  evaluateReturnOperation,
  evaluateRoundingOperation,
  evaluateSetOperation,
  evaluateVariableOperation,
  getInventory,
  getItem,
  ifConditionPassed,
  operationIsOnInactiveBranch,
} from './evaluation-functions';
import { evaluateAnnounceOperation } from './evaluation-functions/announce';
import { evaluateSideEffectOperation } from './evaluation-functions/side-effect';

function inverseBooleanValue(value?: LogicalValue) {
  if (value === 'true') return 'false';
  if (value === 'false') return 'true';
  return value;
}

function readPrimitiveValue(operation: Operation, shouldUseTestValue = true) {
  if (
    shouldUseTestValue &&
    operation.data?.testValue !== undefined &&
    operation.data?.testValue !== null &&
    operation.data?.testValue !== ''
  ) {
    return operation.data?.inverse
      ? inverseBooleanValue(operation.data.testValue)
      : operation.data.testValue;
  }
  return operation.data?.inverse ? inverseBooleanValue(operation.value) : operation.value;
}

export const evaluateOperation = (
  operationId: string,
  logic: Logic,
  setOperationErrors: (errors: EvaluationError[]) => void,
  shouldUseTestValue = true,
  items: ContextualItem[] = [],
  charts: Chart[] = [],
  logEvent: (event: EventLog) => void,
) => {
  const operation = logic.find((op) => op.id === operationId);
  if (!operation) return;

  const isOnInactiveBranch = operationIsOnInactiveBranch(operation, logic);

  if (isOnInactiveBranch) {
    return '';
  }

  const onError = (error: EvaluationError) => {
    setOperationErrors([error]);
  };

  let result: LogicalValue | undefined;

  switch (operation.type) {
    case OperationType.DefaultValue:
    case OperationType.Number:
    case OperationType.Boolean:
    case OperationType.Attribute:
    case OperationType.Text:
    case OperationType.Comment:
    case OperationType.Ability:
      result = readPrimitiveValue(operation, shouldUseTestValue);
      break;

    case OperationType.Set:
      result = evaluateSetOperation(operation, logic);
      break;

    case OperationType.Not:
      result = evaluateNotOperation(operation, logic, onError);
      break;

    case OperationType.SideEffect:
    case OperationType.SetItem:
      result = evaluateSideEffectOperation(operation, logic);
      break;

    case OperationType.If:
      result = ifConditionPassed(operation, logic).toString();
      break;

    case OperationType.Variable:
      result = evaluateVariableOperation(operation, logic, shouldUseTestValue);
      break;

    case OperationType.Return:
      result = evaluateReturnOperation(operation, logic);
      break;

    case OperationType.Add:
    case OperationType.Subtract:
    case OperationType.Multiply:
    case OperationType.Divide:
      result = evaluateMathOperation(operation, logic, operation.type);
      break;

    case OperationType.Round:
    case OperationType.RoundDown:
    case OperationType.RoundUp:
      result = evaluateRoundingOperation(operation, logic);
      break;

    case OperationType.Exponent:
    case OperationType.Logarithm:
      result = evaluateExponentOperation(operation, logic);
      break;

    case OperationType.And:
    case OperationType.Or:
      result = evaluateBooleanComparison(operation, logic, operation.type, onError);
      break;

    case OperationType.Equal:
    case OperationType.NotEqual:
    case OperationType.GreaterThan:
    case OperationType.LessThan:
    case OperationType.GreaterThanOrEqual:
    case OperationType.LessThanOrEqual:
      result = evaluateComparisonOperation(operation, logic, operation.type);
      break;

    case OperationType.Dice:
      result = evaluateDiceOperation(operation, logic, logEvent, shouldUseTestValue);
      break;

    case OperationType.ChartRef:
      result = evaluateChartOperation(operation, logic, charts, shouldUseTestValue);
      break;

    case OperationType.Announce:
      result = evaluateAnnounceOperation(operation, logic);
      break;

    case OperationType.GetItem:
      result = getItem(operation, items, shouldUseTestValue);
      break;

    case OperationType.Inventory:
      result = getInventory(operation, items, shouldUseTestValue);
      break;
  }

  return result;
};
