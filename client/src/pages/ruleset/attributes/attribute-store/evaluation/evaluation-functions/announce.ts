import { Logic, Operation } from '@/libs/compass-planes';
import { getValueOfInputIfShouldExecute } from './utils';

export function evaluateAnnounceOperation(operation: Operation, logic: Logic) {
  return getValueOfInputIfShouldExecute(operation, logic);
}
