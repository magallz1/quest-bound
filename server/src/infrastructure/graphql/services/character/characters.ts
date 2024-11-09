import { dbClient } from '@/database';
import { AuthorizationContext } from '@/infrastructure/types';

export const characters = async (parent: any, args: any, context: AuthorizationContext) => {
  const { userId } = context;
  const db = dbClient();

  const characters = await db.character.findMany({
    where: {
      userId,
    },
    include: {
      image: true,
      sheet: {
        select: {
          id: true,
          entityId: true,
          templateId: true,
          type: true,
        },
      },
    },
  });

  return characters.map((character: any) => ({
    ...character,
    sheet: {
      ...character.sheet,
      id: character.sheet?.entityId,
      templateId: character.sheet?.templateId
        ? `${character.sheet.templateId}-${character.rulesetId}`
        : null,
    },
  }));
};
