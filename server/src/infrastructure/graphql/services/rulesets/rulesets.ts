import { AuthorizationContext } from '@/infrastructure/types';
import { dbClient } from '@/database';

export const rulesets = async (parent: any, args: any, context: AuthorizationContext) => {
  const { userId, userPermittedRulesetWriteIds, userPermittedRulesetReadIds } = context;

  const db = dbClient();

  const rulesets = await db.ruleset.findMany({
    where: {
      userId,
    },
    include: {
      modules: true,
      user: {
        select: {
          id: true,
          username: true,
        },
      },
      image: true,
      playTesters: {
        include: {
          user: {
            include: {
              avatar: {
                select: {
                  src: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const permissionMap = new Map<string, string[]>();
  rulesets.forEach((ruleset: any) => {
    if (ruleset.userId === userId) {
      permissionMap.set(ruleset.id, ['OWNER', 'WRITE', 'READ']);
    }
    if (userPermittedRulesetReadIds.includes(ruleset.id)) {
      permissionMap.set(ruleset.id, ['READ']);
    }
    if (userPermittedRulesetWriteIds.includes(ruleset.id)) {
      permissionMap.set(ruleset.id, ['WRITE']);
    }
  });

  const publishedRulesets = await db.publishedRuleset.findMany({
    where: {
      userId,
    },
  });

  return rulesets.map((ruleset: any) => ({
    ...ruleset,
    permissions: permissionMap.get(ruleset.id) ?? [],
    rulesetPermissions:
      typeof ruleset.rulesetPermissions === 'string'
        ? ruleset.rulesetPermissions
        : JSON.stringify(ruleset.rulesetPermissions),
    published: !!publishedRulesets.find((rs: any) => rs.id === ruleset.id),
    approved: !!publishedRulesets.find((rs: any) => rs.id === ruleset.id && rs.approved),
    playtesters: ruleset.playTesters.map((pt: any) => ({
      ...pt.user,
      avatarSrc: pt.user.avatar?.src ?? null,
    })),
  }));
};
