import { dbClient } from '@/database';
import { AddToShelf } from '@/infrastructure/graphql/generated-types';
import { AuthorizationContext, ResolverInput, ResourceLimit } from '@/infrastructure/types';
import { addToShelf as addToShelfUtil, throwIfLimitExceeded } from '../../_shared';
import { getCache } from '@/infrastructure/cache';

/**
 * Creates a copy of all entities related to a published module and asscoiates them with the ruleset
 */
export const addToShelf = async (
  parent: any,
  args: ResolverInput<AddToShelf>,
  context: AuthorizationContext,
) => {
  const { userId, userRole } = context;

  const db = dbClient();
  const cache = getCache();

  const { input } = args;

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

  const publishedRuleset = await db.publishedRuleset.findUnique({
    where: {
      id: input.id,
    },
    include: {
      userPermissions: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!publishedRuleset) {
    throw Error('Ruleset not found.');
  }

  const isOfficialRuleset = await db.officialContent.findFirst({
    where: {
      entityId: input.id,
    },
  });

  if (!isOfficialRuleset) {
    const userPermission = publishedRuleset.userPermissions.find((p: any) => p.userId === userId);

    if (!userPermission) {
      throw Error('Unauthorized');
    }
  }

  const rs = await addToShelfUtil({
    db,
    input,
    userId,
    username: user?.username ?? undefined,
  });

  // evict user from cache so permitted rulesets will be refetched
  cache.del(userId);

  return rs;
};
