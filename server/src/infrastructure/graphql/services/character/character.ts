import { AuthorizationContext } from '@/infrastructure/types';
import { CharacterQueryVariables } from '../../generated-types';
import { dbClient } from '@/database';
import { convertEntityId } from '../_shared';

export const character = async (
  parent: any,
  args: CharacterQueryVariables,
  context: AuthorizationContext,
) => {
  const { userId } = context;
  const { id } = args;

  const db = dbClient();

  const character = await db.character.findUnique({
    where: {
      id,
    },
    include: {
      image: true,
      sheet: true,
      pages: {
        include: {
          sheet: {
            include: {
              backgroundImage: true,
            },
          },
        },
      },
    },
  });

  if (!character) {
    throw Error('character not found.');
  }

  const attributes = await db.attribute.findMany({
    where: {
      rulesetId: character.rulesetId,
    },
  });

  // Characters may be fetched without auth if they are streaming
  if (character.streamTabId === null && character.userId !== userId) {
    throw Error('Unauthorized');
  }

  const { toEntity } = convertEntityId(character.rulesetId);

  return {
    ...character,
    attributeData: JSON.stringify(character.attributeData),
    itemData: JSON.stringify(character.itemData),
    // Only return attributes on a stream page to save cache memory
    attributes:
      character.streamTabId === null
        ? []
        : attributes.map((attribute: any) => ({
            ...attribute,
            id: attribute.entityId,
            data: JSON.stringify(attribute.data),
          })),
    sheet: {
      ...character.sheet,
      id: character.sheet?.entityId,
      templateId: character.sheet?.templateId ? toEntity(character.sheet.templateId) : null,
    },
    pages: character.pages.map((page: any) => ({
      ...page,
      id: page.entityId,
      parentId: page.parentId ? toEntity(page.parentId) : undefined,
      sheet: {
        ...page.sheet,
        id: page.sheet?.entityId,
        templateId: page.sheet?.templateId ? toEntity(page.sheet.templateId) : null,
      },
    })),
  };
};
