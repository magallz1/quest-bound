import { dbClient } from '@/database';
import { getCache } from '@/infrastructure/cache';
import { UpdateRulesetPermission } from '@/infrastructure/graphql';
import { AuthorizationContext, ResolverInput } from '@/infrastructure/types';

export const updateRulesetPermission = async (
  parent: any,
  args: ResolverInput<UpdateRulesetPermission>,
  context: AuthorizationContext,
) => {
  const { userId } = context;

  const {
    input: { shelved, rulesetId, permission },
  } = args;

  const db = dbClient();
  const cache = getCache();

  const currentUserPermissions = await db.publishedRulesetPermission.findMany({
    where: {
      userId,
      rulesetId,
    },
  });

  const userHasPermission = currentUserPermissions.find(
    ({ userId: existingUserId, type }: { userId: any; type: any }) =>
      existingUserId === userId && type === permission,
  );

  if (!userHasPermission) {
    throw Error('User does not have the requested permission');
  }

  const publishedRuleset = await db.publishedRuleset.findUnique({
    where: { id: rulesetId },
  });

  if (!publishedRuleset) {
    throw Error('Ruleset has not been published');
  }

  await db.publishedRulesetPermission.update({
    where: {
      id: userHasPermission.id,
    },
    data: {
      shelved,
    },
  });

  // evict user from cache so permitted rulesets will be refetched
  cache.del(userHasPermission.id);

  return `Succesfully updated permission`;
};
