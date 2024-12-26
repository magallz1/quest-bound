import { AuthorizationContext, ResolverInput } from '@/infrastructure/types';
import { UpdateRuleset } from '../../generated-types';
import { dbClient } from '@/database';

export const updateRuleset = async (
  parent: any,
  args: ResolverInput<UpdateRuleset>,
  context: AuthorizationContext,
) => {
  const { userId } = context;

  const { input } = args;

  const db = dbClient();

  const existingRuleset = await db.ruleset.findUnique({
    where: {
      id: input.id,
    },
  });

  if (!existingRuleset) {
    throw Error('Ruleset not found.');
  }

  if (existingRuleset.userId !== userId) {
    throw Error('Unauthorized');
  }

  const ruleset = await db.ruleset.update({
    where: {
      id: input.id,
    },
    include: {
      sheets: {
        include: {
          image: true,
        },
      },
      image: true,
      user: {
        select: {
          username: true,
          id: true,
        },
      },
    },
    data: {
      title: input.title ?? undefined,
      description: input.description ?? undefined,
      rulesetPermissions: input.rulesetPermissions ?? undefined,
      details: input.details ?? undefined,
      isModule: input.isModule ?? undefined,
      imageId: input.imageId,
    },
  });

  return ruleset;
};
