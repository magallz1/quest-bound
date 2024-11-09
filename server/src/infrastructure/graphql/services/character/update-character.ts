import { AuthorizationContext } from '@/infrastructure/types';
import { UpdateCharacterMutationVariables } from '../../generated-types';
import { dbClient } from '@/database';
import { createSheetFromTemplate } from '../_shared';
import { pubsub } from '../pubsub';
import { StreamSubscriptionType } from '../subscriptions';

export const updateCharacter = async (
  parent: any,
  args: UpdateCharacterMutationVariables,
  context: AuthorizationContext,
) => {
  const { userId } = context;
  const { input } = args;

  const db = dbClient();

  const updatedAttributeData = input.attributeData ? JSON.parse(input.attributeData) : undefined;
  const updatedItemData = input.itemData ? JSON.parse(input.itemData) : undefined;

  const character = await db.character.update({
    where: {
      id: input.id,
      userId,
    },
    data: {
      name: input.name ?? undefined,
      attributeData: updatedAttributeData,
      itemData: updatedItemData,
      imageId: input.imageId ?? undefined,
      streamTabId: input.streamTabId,
    },
    include: {
      image: true,
      sheet: true,
      pages: true,
    },
  });

  if (input.templateId) {
    // Delete existing sheet
    await db.sheet.delete({
      where: {
        id: character.sheet?.id,
      },
    });

    // Create new one
    await createSheetFromTemplate({
      db,
      createdFromPublishedRuleset: character.createdFromPublishedRuleset,
      templateId: `${input.templateId}-${character.rulesetId}`,
      characterId: character.id,
      rulesetId: character.rulesetId,
      overrides: {
        title: `${character.name}'s Sheet`,
      },
    });
  }

  if (character.streamTabId) {
    const attributes = await db.attribute.findMany({
      where: {
        rulesetId: character.rulesetId,
      },
    });

    pubsub.publish(`${StreamSubscriptionType.streamCharacter}_${character.id}`, {
      streamCharacter: {
        ...character,
        id: character.entityId,
        attributeData: JSON.stringify(character.attributeData),
        itemData: JSON.stringify(character.itemData),
        attributes: attributes.map((attribute: any) => ({
          ...attribute,
          id: attribute.entityId,
          data: JSON.stringify(attribute.data),
        })),
      },
    });
  }

  return {
    ...character,
    id: character.entityId,
    attributeData: JSON.stringify(character.attributeData),
    itemData: JSON.stringify(character.itemData),
  };
};
