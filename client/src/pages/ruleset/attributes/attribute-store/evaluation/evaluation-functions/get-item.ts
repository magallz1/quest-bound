import { ContextualItem } from '@/libs/compass-api';
import { LogicalValue, Operation } from '@/libs/compass-planes';

export const getItem = (
  operation: Operation,
  items: ContextualItem[],
  useTestValue: boolean,
): LogicalValue => {
  const selectedItem = items.find((item) => item.id === operation.attributeRef);
  const selectedPropertyId = operation.data?.selectedPropertyId ?? 'quantity';

  if (!selectedItem) return 'Unable to find item';

  const selectedProperty = selectedItem.properties.find((prop) => prop.id === selectedPropertyId);

  if (!selectedProperty) return 'Unable to find property';

  if (useTestValue) return operation.data?.testValue ?? selectedProperty.value?.toString() ?? '';

  return selectedProperty.value?.toString() ?? '';
};
