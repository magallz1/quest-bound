import { ContextualItem } from '@/libs/compass-api';
import { LogicalValue, Operation } from '@/libs/compass-planes';

export const getInventory = (
  operation: Operation,
  items: ContextualItem[],
  useTestValue: boolean,
): LogicalValue => {
  const weight = items
    .map((item) => {
      const itemQty = (item.properties.find((property) => property.id === 'quantity')?.value ??
        0) as number;
      return itemQty * item.data.weight;
    })
    .reduce((acc, curr) => acc + curr, 0);

  if (useTestValue) return operation.data?.testValue ?? weight ?? '';

  return weight;
};
