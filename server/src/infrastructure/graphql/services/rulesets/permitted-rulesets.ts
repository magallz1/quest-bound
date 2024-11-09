import { AuthorizationContext } from '@/infrastructure/types';
import { dbClient } from '@/database';

export const permittedRulesets = async (parent: any, args: any, context: AuthorizationContext) => {
  const { userId } = context;

  const db = dbClient();

  const permittedRulesets = await db.publishedRuleset.findMany({
    where: {
      userPermissions: {
        some: {
          AND: {
            userId,
            shelved: true,
            type: {
              not: 'OWNER',
            },
          },
        },
      },
    },
    include: {
      image: true,
      userPermissions: {
        select: {
          type: true,
          userId: true,
        },
      },
    },
  });

  return permittedRulesets.map((ruleset: any) => ({
    ...ruleset,
    published: true,
    rulesetPermissions:
      typeof ruleset.rulesetPermissions === 'string'
        ? ruleset.rulesetPermissions
        : JSON.stringify(ruleset.rulesetPermissions),
    permissions: ruleset.userPermissions
      .filter((p: any) => p.userId === userId)
      .map(({ type }: { type: any }) => type),
  }));
};
