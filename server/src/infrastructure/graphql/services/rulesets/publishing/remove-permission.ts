import { dbClient } from '@/database';
import { getCache } from '@/infrastructure/cache';
import { RemoveRulesetPermission } from '@/infrastructure/graphql';
import { AuthorizationContext, PermissionType, ResolverInput } from '@/infrastructure/types';

export const removeRulesetPermission = async (
  parent: any,
  args: ResolverInput<RemoveRulesetPermission>,
  context: AuthorizationContext,
) => {
  const { userId } = context;

  const {
    input: { userId: userToRemoveId, rulesetId, permission },
  } = args;

  const db = dbClient();
  const cache = getCache();

  const currentUserPermissions = await db.publishedRulesetPermission.findMany({
    where: {
      userId,
      rulesetId,
    },
  });

  const userCurrentPermissions = await db.publishedRulesetPermission.findMany({
    where: {
      userId: userToRemoveId,
      rulesetId,
    },
  });

  const permissionToRemove = userCurrentPermissions.find(
    ({ userId: existingUserId, type }: { userId: string; type: any }) =>
      existingUserId === userToRemoveId && type === permission,
  );

  if (!permissionToRemove) {
    throw Error('User does not have this permission');
  }

  const currentUserIsOwner = currentUserPermissions.some(
    ({ type }: { type: any }) => type === PermissionType.OWNER,
  );

  // Users may remove themselves
  if (!currentUserIsOwner && permissionToRemove.userId !== userId) {
    throw Error('Unauthorized');
  }

  await db.publishedRulesetPermission.delete({
    where: {
      id: permissionToRemove.id,
    },
  });

  // evict user from cache so permitted rulesets will be refetched
  cache.del(userToRemoveId);

  return `Succesfully removed ${userToRemoveId} to ${rulesetId} with permission ${permission}`;
};
