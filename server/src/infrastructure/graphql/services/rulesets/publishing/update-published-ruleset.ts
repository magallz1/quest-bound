import { AuthorizationContext, ResolverInput } from '@/infrastructure/types';
import { UpdatePublishedRuleset } from '../../../generated-types';
import { dbClient } from '@/database';

export const updatePublishedRuleset = async (
  parent: any,
  args: ResolverInput<UpdatePublishedRuleset>,
  context: AuthorizationContext,
) => {
  const { userId } = context;

  const { input } = args;

  const db = dbClient();

  const existingRuleset = await db.publishedRuleset.findUnique({
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

  const ruleset = await db.publishedRuleset.update({
    where: {
      id: input.id,
    },
    data: {
      title: input.title ?? undefined,
      description: input.description ?? undefined,
      rulesetPermissions: input.rulesetPermissions ?? undefined,
      details: input.details ?? undefined,
      isModule: input.isModule ?? undefined,
      imageId: input.imageId ?? undefined,
      live: input.live ?? undefined,
      version: input.version ?? undefined,
      currentPrice: input.price ?? undefined,
      includesAI: input.includesAI ?? undefined,
      includesPDF: input.includesPDF ?? undefined,
      explicit: input.explicit ?? undefined,
    },
  });

  return ruleset;
};
