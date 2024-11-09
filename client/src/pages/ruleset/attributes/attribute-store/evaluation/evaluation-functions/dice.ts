import { IOType, Logic, LogicalValue, Operation } from '@/libs/compass-planes';
import { EventLog, LogType } from '@/stores';
import { getUpstreamConnectionsOfType } from './utils';

type Result = {
  descriptor: string;
  value: number;
};

let prevResultMap = new Map<string, Result>();

export function evaluateDiceOperation(
  operation: Operation,
  logic: Logic,
  logEvent: (event: EventLog) => void,
  isInLogicEditor: boolean,
): LogicalValue {
  const describeConnections = getUpstreamConnectionsOfType(operation, logic, IOType.Describe);
  const diceSelectOperation = describeConnections[0];

  if (!diceSelectOperation) return 0;

  const diceType = diceSelectOperation?.value;
  if (!diceType || typeof diceType !== 'string') return 0;

  const prevResult = prevResultMap.get(operation.id);

  // In the logic editor, only re-roll if the dice type has changed
  if (diceType === prevResult?.descriptor && isInLogicEditor) return prevResult?.value || 0;

  const [numberOfDice, diceSides] = diceType.split('d').map((n) => parseInt(n, 10));
  let dicePool = [];
  for (let i = 0; i < numberOfDice; i++) {
    dicePool.push(Math.floor(Math.random() * diceSides) + 1);
  }

  let result = dicePool.reduce((acc, val) => acc + val, 0);

  if (isNaN(result)) {
    result = 0;
    return result;
  }

  prevResultMap.set(operation.id, {
    descriptor: diceType,
    value: result,
  });

  logEvent({
    type: LogType.DICE,
    message: `Rolled ${diceType}: ${result}`,
  });

  return result;
}
