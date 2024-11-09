import { Coordinates } from '@/libs/compass-planes';
import { Attribute, AttributeType } from '../gql';
import { ContextualItem, ContextualItemData } from '../providers';

export function buildContextualItemFromAttribute(
  attribute: Attribute,
  parentId?: string,
  coordinates?: Coordinates,
): ContextualItem {
  const logic = JSON.parse(attribute.logic ?? '[]');
  const propertyNodes = logic.filter((node: any) => node.type === 'property');
  const abilityNodes = logic.filter((node: any) => node.type === 'ability');

  const data = JSON.parse(attribute.data ?? '{}') as ContextualItemData;

  const initialProperties = [];
  if (data.stackable !== false) {
    initialProperties.push({
      id: 'quantity',
      name: 'Quantity',
      value: data?.quantity ?? 1,
      type: AttributeType.NUMBER,
    });
  }

  if (data.equippable !== false) {
    initialProperties.push({
      id: 'equipped',
      name: 'Equipped',
      value: 'false',
      type: AttributeType.BOOLEAN,
    });
  }

  return {
    id: attribute.id,
    instanceId: attribute.id,
    name: attribute.name,
    typeOf: attribute.name,
    description: attribute.description ?? '',
    logic,
    data: {
      maxQuantity: data.maxQuantity ? parseInt(`${data.maxQuantity}`) : undefined,
      weight: data.weight ?? 0,
      width: data.width ?? 0,
      height: data.height ?? 0,
      stackable: data.stackable ?? true,
      equippable: data.equippable ?? true,
      slots: data.slots ?? '',
      imageSrc: attribute.image?.src ?? undefined,
      parentId,
      x: coordinates?.x ?? 0,
      y: coordinates?.y ?? 0,
    },
    properties: [
      ...initialProperties,
      ...propertyNodes.map((node: any) => ({
        id: node.data?.name?.toLowerCase() ?? '',
        name: node.data?.name,
        type: node.data?.type,
        value: node.data?.defaultValue,
      })),
    ],
    abilities: abilityNodes.map((node: any) => ({
      id: node.id,
      name: node.data?.name ?? '',
      description: node.data?.description ?? '',
    })),
  };
}

/**
 * Used to convert ruleset items to contextual items for the logic editor.
 * When character context is in play, these are pulled directly from characterItemData
 */
export function buildContextualItems(rulesetItems: Attribute[]): ContextualItem[] {
  return rulesetItems.map((attr) => buildContextualItemFromAttribute(attr));
}
