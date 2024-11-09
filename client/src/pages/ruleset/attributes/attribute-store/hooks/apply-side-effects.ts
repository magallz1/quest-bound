import { ContextualAttribute, ContextualItem, UpdateCharacterItem } from '@/libs/compass-api';
import { Logic, LogicalValue, Operation, OperationType } from '@/libs/compass-planes';
import { replaceTextWithinBracketsWithAttributes } from '@/libs/compass-web-utils';
import { LogType } from '@/stores';
import { UpdateCharacterAttributeProps } from '../types';

interface ApplySideEffectsArgs {
  attributeName: string;
  logic: Logic;
  data: ContextualAttribute[];
  items: ContextualItem[];
  evaluateLogic: (
    logic: Logic,
    data: ContextualAttribute[],
    items: ContextualItem[],
  ) => { evaluatedLogic: Logic };
  attributeValueMap: Map<string, LogicalValue | null | undefined>;
  attributes: ContextualAttribute[];
  updateCharacterAttribute: (args: UpdateCharacterAttributeProps) => void;
  updateItem: (args: UpdateCharacterItem) => void;
  addNotification: (msg: LogicalValue, announcementId?: string) => void;
  characterId?: string;
}

export function applySideEffects({
  logic,
  data,
  items,
  attributeName,
  evaluateLogic,
  attributeValueMap,
  attributes,
  updateCharacterAttribute,
  addNotification,
  characterId,
  updateItem,
}: ApplySideEffectsArgs) {
  const sideEffects = logic.filter(
    (op) =>
      (op.type === OperationType.SideEffect || op.type === OperationType.SetItem) &&
      !!op.attributeRef,
  );

  const announcements = logic.filter((op) => op.type === OperationType.Announce);

  if ([...sideEffects, ...announcements].length > 0) {
    const logicWithInjectedAttributes = applyAttributeValuesToLogic(
      logic,
      attributeValueMap,
      attributes,
    );

    const { evaluatedLogic } = evaluateLogic(logicWithInjectedAttributes, data, items);

    for (const sideEffect of sideEffects) {
      const result = evaluatedLogic.find((op) => op.id === sideEffect.id)?.value;
      if (result === undefined || result === '') continue;

      if (sideEffect.type === OperationType.SetItem) {
        const firstInstanceOfItem = items.find((item) => item.id === sideEffect.attributeRef);
        if (!firstInstanceOfItem) continue;

        updateItem({
          id: firstInstanceOfItem.instanceId,
          propertyId: sideEffect.data?.selectedPropertyId ?? 'quantity',
          value: result?.toString() ?? '',
        });
      } else {
        updateCharacterAttribute({
          id: sideEffect.attributeRef!,
          value: result,
          providedAttributeData: data,
          logType: LogType.SIDE_EFFECT,
          logSource: attributeName,
          providedCharacterId: characterId,
        });
      }
    }

    for (const operation of announcements) {
      const announceValue = evaluatedLogic.find((op) => op.id === operation.id)?.value;
      if (announceValue) {
        addNotification(announceValue, operation?.data?.announcementId);
      }
    }
  }
}

export function applyAttributeValuesToLogic(
  logic: Logic,
  attributeValueMap: Map<string, LogicalValue | null | undefined>,
  attributes: ContextualAttribute[],
) {
  return logic.map((op: Operation) => {
    if (op.type === OperationType.Text) {
      const attrsWithValues: ContextualAttribute[] = attributes.map((attr) => ({
        ...attr,
        value:
          attributeValueMap.get(attr.id) !== undefined
            ? `${attributeValueMap.get(attr.id)}`
            : attr.value ?? attr.defaultValue,
      }));
      return {
        ...op,
        value: replaceTextWithinBracketsWithAttributes(op.value, attrsWithValues),
      };
    }

    let valueMapId =
      op.type !== OperationType.GetItem
        ? op.attributeRef
        : `${op.attributeRef}-${op.data?.selectedPropertyId}`;

    if (op.type === OperationType.Ability) {
      valueMapId = op.id;
    }

    if (!valueMapId) return op;
    return {
      ...op,
      value: attributeValueMap.get(valueMapId) ?? op.value,
    };
  });
}
