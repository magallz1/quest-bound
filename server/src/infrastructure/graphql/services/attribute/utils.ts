import { Attribute } from '../../generated-types';

/**
 * Injects the default value into the defaultValue operation
 * Filters out any corrupted operations
 */
export function syncAttributeLogic(attribute: any): Attribute {
  const injectedAttribute = {
    ...attribute,
    logic: JSON.stringify(
      JSON.parse(attribute.logic)
        .filter((op: any) => !!op.id)
        .map((op: any) => {
          if (op.type !== 'default-value') return op;
          return {
            ...op,
            value: attribute.defaultValue,
          };
        }),
    ),
  };

  return injectedAttribute;
}
