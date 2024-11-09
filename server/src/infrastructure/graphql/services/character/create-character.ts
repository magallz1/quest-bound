import { v4 as uuidv4 } from 'uuid';
import { CreateCharacterMutationVariables, SheetType } from '../../generated-types';
import { AuthorizationContext, ResourceLimit } from '@/infrastructure/types';
import { dbClient } from '@/database';
import { createSheetFromTemplate, throwIfLimitExceeded } from '../_shared';

export const createCharacter = async (
  parent: any,
  args: CreateCharacterMutationVariables,
  context: AuthorizationContext,
) => {
  const { userId, userRole } = context;

  const { input } = args;

  const db = dbClient();

  const getRuleset = async () => {
    if (input.createdFromPublishedRuleset) {
      return await db.publishedRuleset.findUnique({
        where: {
          id: input.rulesetId,
        },
      });
    }
    return await db.ruleset.findUnique({
      where: {
        id: input.rulesetId,
      },
    });
  };

  const existingCharacters = await db.character.findMany({
    where: {
      userId,
      rulesetId: input.rulesetId,
    },
  });

  throwIfLimitExceeded({
    role: userRole,
    existingCount: existingCharacters.length,
    resource: ResourceLimit.CHARACTER,
  });

  const ruleset = await getRuleset();

  const character = await db.character.create({
    data: {
      rulesetId: input.rulesetId,
      rulesetTitle: ruleset?.title ?? '',
      userId,
      name: input.name,
      createdFromPublishedRuleset: input.createdFromPublishedRuleset,
      imageId: input.imageId,
      // TODO: This should only store values if they're different from ruleset defaults
      attributeData: [],
      itemData: [],
    },
  });

  if (input.templateId) {
    await createSheetFromTemplate({
      db,
      createdFromPublishedRuleset: input.createdFromPublishedRuleset,
      templateId: `${input.templateId}-${input.rulesetId}`,
      characterId: character.id,
      rulesetId: input.rulesetId,
      overrides: {
        title: `${character.name}'s Sheet`,
      },
    });
  } else {
    const entityId = uuidv4();
    await db.sheet.create({
      data: {
        id: `${entityId}-${input.rulesetId}`,
        entityId,
        rulesetId: input.rulesetId,
        characterId: character.id,
        title: `${character.name}'s Sheet`,
        type: SheetType.SHEET,
        details: JSON.stringify({
          defaultFont: 'Roboto Condensed',
          colors: [],
          snapToGrid: true,
          enableLogic: true,
          renderGrid: 'square',
        }),
        tabs: JSON.stringify([
          {
            title: 'New Page',
            position: 0,
            tabId: uuidv4(),
          },
        ]),
        sections: '[]',
      },
    });
  }

  return {
    ...character,
    attributeData: JSON.stringify(character.attributeData),
    attributes: [],
  };
};
