import { dbClient } from '@/database';
import { getCache } from '@/infrastructure/cache';
import { AddPlaytester } from '@/infrastructure/graphql/generated-types';
import { AuthorizationContext, ResolverInput, ResourceLimit } from '@/infrastructure/types';
import { throwIfLimitExceeded } from '../../_shared';

export const addPlaytester = async (
  parent: any,
  args: ResolverInput<AddPlaytester>,
  context: AuthorizationContext,
) => {
  const { userId, userRole } = context;

  const {
    input: { userId: userToAddId, rulesetId },
  } = args;

  const db = dbClient();
  const cache = getCache();

  const ruleset = await db.ruleset.findUnique({
    where: {
      id: rulesetId,
    },
    include: {
      playTesters: true,
      user: true,
    },
  });

  if (!ruleset) {
    throw Error('Ruleset not found');
  }

  if (ruleset.user.id !== userId) {
    throw Error('Unauthorized');
  }

  if (
    ruleset.playTesters.find(
      ({ userId: existingUserId }: { userId: string }) => existingUserId === userToAddId,
    )
  ) {
    throw Error('User already a playtester');
  }

  throwIfLimitExceeded({
    role: userRole,
    existingCount: ruleset.playTesters.length,
    resource: ResourceLimit.PLAYER,
  });

  const publishedRuleset = await db.publishedRuleset.findUnique({
    where: {
      id: rulesetId,
    },
    include: {
      userPermissions: {
        select: {
          userId: true,
        },
      },
    },
  });

  if (publishedRuleset) {
    const userHasPublishedRulesetPermission = publishedRuleset.userPermissions.some(
      ({ userId: existingUserId }: { userId: string }) => existingUserId === userToAddId,
    );

    // No need to add a user as a player if they already own the ruleset
    if (userHasPublishedRulesetPermission) {
      throw Error('User has existing read permissions for this ruleset.');
    }
  }

  await db.playTester.create({
    data: {
      userId: userToAddId,
      rulesetId,
    },
  });

  // evict user from cache so permitted rulesets will be refetched
  cache.del(userToAddId);

  return `Succesfully added ${userToAddId} to ${rulesetId}`;
};
