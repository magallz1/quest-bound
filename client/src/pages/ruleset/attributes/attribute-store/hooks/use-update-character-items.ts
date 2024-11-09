import {
  Attribute,
  Chart,
  ContextualAttribute,
  ContextualItem,
  UpdateCharacterItem,
  useUpdateCharacter,
} from '@/libs/compass-api';
import { buildContextualItemFromAttribute } from '@/libs/compass-api/utils/build-items';
import { Coordinates } from '@/libs/compass-planes';
import { emitter, generateId } from '@/libs/compass-web-utils';

interface UseUpdateCharacterItemsProps {
  attributes: ContextualAttribute[];
  items: ContextualItem[];
  rulesetItems: Attribute[];
  characterId: string;
  cacheOnly: boolean;
  charts: Chart[];
}

export const useUpdateCharacterItems = ({
  attributes,
  charts,
  items,
  rulesetItems,
  characterId,
  cacheOnly,
}: UseUpdateCharacterItemsProps) => {
  const { updateCharacter } = useUpdateCharacter(2000);

  const updateItem = ({ id, propertyId, value, name, description }: UpdateCharacterItem) => {
    const itemToUpdate = items.find((item) => item.instanceId === id);
    if (!itemToUpdate) return;

    if (name || description) {
      updateCharacter(
        {
          id: characterId,
          itemData: JSON.stringify(
            items.map((item) =>
              item.instanceId === id
                ? {
                    ...item,
                    name: name ?? item.name,
                    description: description ?? item.description,
                  }
                : item,
            ),
          ),
        },
        { cacheOnly },
      );
      return;
    }

    const attributesWithUpdate = attributes.map((attribute) =>
      attribute.id === `${itemToUpdate.id}-${propertyId}` ? { ...attribute, value } : attribute,
    );

    const itemsWithUpdate = items.map((item) =>
      item.instanceId === id
        ? {
            ...item,
            properties: item.properties.map((property) =>
              property.id === propertyId ? { ...property, value } : property,
            ),
          }
        : item,
    );

    emitter.emit(
      `attribute:${itemToUpdate.id}-${propertyId}:change`,
      attributesWithUpdate,
      characterId,
      charts,
      itemsWithUpdate,
    );

    updateCharacter(
      {
        id: characterId,
        itemData: JSON.stringify(itemsWithUpdate),
      },
      { cacheOnly },
    );

    if (propertyId === 'quantity' && value === '0') {
      removeItem(id);
    }
  };

  const updateItemsPositions = (updates: Array<{ id: string; x: number; y: number }>) => {
    const itemsWithUpdate = items.map((item) => {
      const update = updates.find((update) => update.id === item.instanceId);
      return update ? { ...item, data: { ...item.data, x: update.x, y: update.y } } : item;
    });

    updateCharacter(
      {
        id: characterId,
        itemData: JSON.stringify(itemsWithUpdate),
      },
      { cacheOnly },
    );
  };

  const addItem = (
    item: Attribute,
    parentId?: string,
    coordinates?: Coordinates & { rotated: boolean },
  ) => {
    const rulesetItem = rulesetItems.find((i) => i.id === item.id) ?? item;
    const itemWithLogic = {
      ...item,
      logic: rulesetItem?.logic ?? item.logic,
    };

    const contextualItem = buildContextualItemFromAttribute(itemWithLogic, parentId, coordinates);

    const itemsWithUpdate = [
      ...items,
      {
        ...contextualItem,
        instanceId: generateId(),
      },
    ];

    let attributesWithUpdate = [...attributes];

    for (const property of contextualItem.properties) {
      attributesWithUpdate = attributesWithUpdate.map((attribute) =>
        attribute.id === `${contextualItem.id}-${property.id}`
          ? { ...attribute, value: property.value !== null ? `${property.value}` : '' }
          : attribute,
      );

      emitter.emit(
        `attribute:${contextualItem.id}-${property.id}:change`,
        attributesWithUpdate,
        characterId,
        charts,
        itemsWithUpdate,
      );
    }

    updateCharacter(
      {
        id: characterId,
        itemData: JSON.stringify(itemsWithUpdate),
      },
      { cacheOnly },
    );
  };

  const removeItem = (id: string) => {
    const itemToUpdate = items.find((item) => item.instanceId === id);
    if (!itemToUpdate) return;

    let attributesWithUpdate = [...attributes];

    for (const property of itemToUpdate.properties) {
      attributesWithUpdate = attributesWithUpdate.map((attribute) =>
        attribute.id === `${itemToUpdate.id}-${property.id}`
          ? { ...attribute, value: property.value !== null ? `${property.value}` : '' }
          : attribute,
      );

      emitter.emit(
        `attribute:${itemToUpdate.id}-${property.id}:change`,
        attributesWithUpdate,
        characterId,
        charts,
        items.filter((item) => item.instanceId !== id),
      );
    }

    updateCharacter(
      {
        id: characterId,
        itemData: JSON.stringify(items.filter((item: ContextualItem) => item.instanceId !== id)),
      },
      { cacheOnly },
    );
  };

  return {
    addItem,
    removeItem,
    updateItem,
    updateItemsPositions,
  };
};
