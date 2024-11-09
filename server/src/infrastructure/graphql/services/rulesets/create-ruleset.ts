import { AuthorizationContext, ResolverInput, ResourceLimit } from '@/infrastructure/types';
import { CreateRuleset, SheetType } from '../../generated-types';
import { dbClient } from '@/database';
import { getCache } from '@/infrastructure/cache';
import { throwIfLimitExceeded } from '../_shared';

export const createRuleset = async (
  parent: any,
  args: ResolverInput<CreateRuleset>,
  context: AuthorizationContext,
) => {
  const { userId, userRole } = context;

  const { input } = args;

  const db = dbClient();
  const cache = getCache();

  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      rulesets: {
        select: {
          _count: true,
        },
      },
    },
  });

  if (!user) {
    throw Error('User not found');
  }

  throwIfLimitExceeded({
    role: userRole,
    existingCount: user.rulesets.length,
    resource: ResourceLimit.RULESET,
  });

  const ruleset = await db.ruleset.create({
    data: {
      userId,
      title: input.title ?? 'New Ruleset',
      description: input.description ?? '',
      details: JSON.stringify({
        ...JSON.parse(input.details ?? '{}'),
        archetypeSheetId: `archetype`,
        creatureSheetId: `creature`,
      }),
      imageId: input.imageId ?? undefined,
      createdBy: user.username ?? undefined,
      createdById: userId,
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });

  await db.chart.create({
    data: {
      id: `archetypes-${ruleset.id}`,
      rulesetId: ruleset.id,
      data: [[]],
      fileKey: '',
      title: `Archetype Chart ${ruleset.title}`,
    },
  });

  // evict user from cache so permitted rulesets will be refetched
  cache.del(userId);

  return ruleset;
};
