import { dbClient } from '@/database';
import { getCache } from '@/infrastructure/cache';
import { AddRulesetPermission } from '@/infrastructure/graphql';
import { AuthorizationContext, PermissionType, ResolverInput } from '@/infrastructure/types';

export const addRulesetPermission = async (
  parent: any,
  args: ResolverInput<AddRulesetPermission>,
  context: AuthorizationContext,
) => {
  const { userId } = context;

  const {
    input: { userId: userToAddId, rulesetId, permission, shelved },
  } = args;

  const db = dbClient();
  const cache = getCache();

  const currentUserPermissions = await db.publishedRulesetPermission.findMany({
    where: {
      userId,
      rulesetId,
    },
  });

  const userAlreadyHasPermission = currentUserPermissions.some(
    ({ userId: existingUserId, type }: { userId: any; type: any }) =>
      existingUserId === userToAddId && type === permission,
  );

  // Not needed while rulesets are self-served. When purchased, this will be done in a webhook
  // if (!currentUserIsOwner) {
  //   throw Error('Unauthorized');
  // }

  if (userAlreadyHasPermission) {
    // Users is re-adding an existing permitted ruleset to shelf
    if (permission === PermissionType.READ) {
      const currentReadPermission = currentUserPermissions.find(
        ({ userId: existingUserId, type }: { userId: any; type: any }) =>
          existingUserId === userToAddId && type === PermissionType.READ,
      );

      if (currentReadPermission && !currentReadPermission.shelved) {
        await db.publishedRulesetPermission.update({
          where: {
            id: currentReadPermission.id,
          },
          data: {
            shelved: true,
          },
        });
      }
      return 'Re-added content to shelf';
    } else {
      throw Error('User already has this permission');
    }
  }

  const publishedRuleset = await db.publishedRuleset.findUnique({
    where: { id: rulesetId },
  });

  if (!publishedRuleset) {
    throw Error('Published ruleset not found');
  }

  const playTester = await db.playTester.findFirst({
    where: {
      rulesetId: rulesetId,
      userId: userToAddId,
      permission: 'READ',
    },
  });

  // No need to have a playtester permission if the user has permission to the published ruleset
  if (playTester) {
    await db.playTester.delete({
      where: {
        id: playTester.id,
      },
    });
  }

  await db.publishedRulesetPermission.create({
    data: {
      userId: userToAddId,
      rulesetId,
      type: permission,
      version: 1,
      shelved: shelved ?? true,
    },
  });

  // evict user from cache so permitted rulesets will be refetched
  cache.del(userToAddId);

  return `Succesfully added ${userToAddId} to ${rulesetId} with permission ${permission}`;
};
