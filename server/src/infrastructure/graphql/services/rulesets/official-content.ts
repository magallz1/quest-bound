import { AuthorizationContext } from '@/infrastructure/types';
import { dbClient } from '@/database';

export const officialContent = async (parent: any, args: any, context: AuthorizationContext) => {
  const db = dbClient();

  const officialContent = await db.officialContent.findMany({
    where: {
      type: {
        not: 'empty',
      },
    },
  });

  const publishedRulesets = await db.publishedRuleset.findMany({
    where: {
      id: {
        in: officialContent.map((rs: any) => rs.entityId),
      },
    },
    include: {
      archetypes: true,
      attributes: true,
      charts: true,
      rulesets: {
        select: {
          title: true,
          id: true,
        },
      },
      image: true,
      sheets: {
        include: {
          image: true,
        },
      },
    },
  });

  const published = publishedRulesets.map((ruleset: any) => ({
    ...ruleset,
    published: true,
    modules: ruleset.rulesets,
    permissions: ['READ'],
  }));

  const rulesets = published.filter((rs: any) => !rs.isModule);
  const modules = published.filter((rs: any) => rs.isModule);

  return {
    rulesets: rulesets.map((ruleset: any) => ({
      ...ruleset,
      rulesetPermissions:
        typeof ruleset.rulesetPermissions === 'string'
          ? ruleset.rulesetPermissions
          : JSON.stringify(ruleset.rulesetPermissions),
    })),
    modules: modules.map((module: any) => ({
      ...module,
      rulesetPermissions:
        typeof module.rulesetPermissions === 'string'
          ? module.rulesetPermissions
          : JSON.stringify(module.rulesetPermissions),
    })),
  };
};
