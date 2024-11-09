import { dbClient } from '@/database';
import { AddModule } from '@/infrastructure/graphql/generated-types';
import { AuthorizationContext, ResolverInput } from '@/infrastructure/types';
import { addModule as addModuleUtil } from '../../_shared';

/**
 * Creates a copy of all entities related to a published module and asscoiates them with the ruleset
 */
export const addModule = async (
  parent: any,
  args: ResolverInput<AddModule>,
  context: AuthorizationContext,
) => {
  const { userId } = context;

  const db = dbClient();

  const { input } = args;

  const existingRuleset = await db.ruleset.findUnique({
    where: {
      id: input.rulesetId,
    },
    include: {
      user: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!existingRuleset) {
    throw Error('Ruleset not found.');
  }

  if (existingRuleset.user.id !== userId) {
    throw Error('Unauthorized');
  }

  const isOfficialModule = await db.officialContent.findFirst({
    where: {
      entityId: input.moduleId,
    },
  });

  if (!isOfficialModule) {
    const module = await db.ruleset.findUnique({
      where: {
        id: input.moduleId,
      },
    });

    if (!module) {
      throw Error('Module not found.');
    }

    if (module.userId !== userId) {
      throw Error('Unauthorized');
    }
  }

  await addModuleUtil({
    db,
    rulesetId: input.rulesetId,
    moduleId: input.moduleId,
    userId,
  });

  const rs = await db.ruleset.update({
    where: {
      id: input.rulesetId,
    },
    data: {
      modules: {
        connect: {
          id: input.moduleId,
        },
      },
    },
  });

  return rs;
};
