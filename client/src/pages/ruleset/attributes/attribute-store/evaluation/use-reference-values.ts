import { Attribute, AttributeType } from '@/libs/compass-api';
import { Logic, LogicalValue, OperationType } from '@/libs/compass-planes';
import { replaceTextWithinBracketsWithAttributes } from '@/libs/compass-web-utils';

interface Props {
  logic: Logic;
  attributes: Attribute[];
  operationOverrides?: Override[];
  attributeOverrides?: Override[];
}

export type Override = {
  id: string;
  value: LogicalValue;
};

/**
 * Prefer to use functions from logic-evaluation.ts instead of this hook when possible.
 *
 * Use this hook when only one attribute is being evaluated, like the logic test panel.
 */
export const useReferenceValues = ({
  logic,
  attributes,
  attributeOverrides,
  operationOverrides,
}: Props) => {
  const injectReferenceValue = (testLogic: Logic): Logic => {
    return testLogic.map((op) => {
      const correspondingOp = logic.find((l) => l.id === op.id);
      if (!correspondingOp) return op;

      if (op.type === OperationType.Attribute) {
        if (attributeOverrides) {
          const override = attributeOverrides.find((o) => o.id === op.attributeRef);
          if (override) {
            return {
              ...correspondingOp,
              value: override.value,
            };
          }
        }

        // Attribute has been cleared
        if (!correspondingOp.attributeRef) return correspondingOp;

        const attribute = attributes.find((attr) => attr.id === correspondingOp.attributeRef);

        if (!attribute) return correspondingOp;

        return {
          ...correspondingOp,
          value:
            attribute.type === AttributeType.NUMBER
              ? parseFloat(attribute.defaultValue)
              : attribute.defaultValue,
        };
      }

      if (op.type === OperationType.SideEffect) {
        const correspondingAttribute = attributes.find(
          (attr) => attr.id === correspondingOp.attributeRef,
        );

        let sideEffectValue = correspondingOp.value;

        if (correspondingAttribute) {
          if (
            correspondingAttribute.type === AttributeType.NUMBER &&
            !isNaN(parseFloat(correspondingAttribute.defaultValue))
          ) {
            sideEffectValue = parseFloat(correspondingAttribute.defaultValue);
          } else {
            sideEffectValue = correspondingAttribute.defaultValue;
          }
        }

        return {
          ...correspondingOp,
          value: sideEffectValue,
        };
      }

      if (op.type === OperationType.Text) {
        const value = op.value;
        const injectedValue = replaceTextWithinBracketsWithAttributes(
          value,
          attributes.map((attr) => ({
            ...attr,
            value:
              attributeOverrides?.find((o) => o.id === attr.id)?.value?.toString() ??
              attr.defaultValue,
          })),
        );

        return {
          ...op,
          value: injectedValue,
        };
      }

      // Generic operation overrides
      if (operationOverrides) {
        const override = operationOverrides.find((o) => o.id === op.id);
        if (override) {
          return {
            ...correspondingOp,
            value: override.value,
          };
        }
      }

      return correspondingOp;
    });
  };

  return {
    injectReferenceValue,
  };
};
