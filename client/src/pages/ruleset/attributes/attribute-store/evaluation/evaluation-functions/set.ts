import { Logic, Operation } from '@/libs/compass-planes';
import { getValueOfInputIfShouldExecute } from './utils';

export function evaluateSetOperation(operation: Operation, logic: Logic) {
  return getValueOfInputIfShouldExecute(operation, logic);
}
