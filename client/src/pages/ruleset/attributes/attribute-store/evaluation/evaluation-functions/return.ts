import { Logic, Operation } from '@/libs/compass-planes';
import { clampValueToAttributeMinMax, getValueOfInputIfShouldExecute } from './utils';

export function evaluateReturnOperation(operation: Operation, logic: Logic) {
  const shouldInverse = operation.data?.inverse;
  const value = getValueOfInputIfShouldExecute(operation, logic, shouldInverse);
  return clampValueToAttributeMinMax(value, logic);
}
