import { AuthorizationContext } from '@/infrastructure/types';
import { PermittedUsersQueryVariables } from '../../generated-types';
import { dbClient } from '@/database';

export const permittedUsers = async (
  parent: any,
  args: PermittedUsersQueryVariables,
  context: AuthorizationContext,
) => {
  const { userId, userPermittedPublishedRulesetReadIds } = context;

  const { id } = args;

  const db = dbClient();

  const ruleset = await db.publishedRuleset.findUnique({
    where: {
      id,
    },
    include: {
      userPermissions: {
        include: {
          user: {
            include: {
              avatar: true,
            },
          },
        },
      },
    },
  });

  if (!ruleset) {
    // PublishedRulesets and Rulesets share IDs. When searching for permitted users on
    // a RS that has not been published, return an empty array.
    return [];
  }

  // Any permission indicates a right to view the ruleset.
  const thisUserIsPermitted = userPermittedPublishedRulesetReadIds.includes(id);

  if (!thisUserIsPermitted) {
    throw Error('Unauthorized');
  }

  const permittedUsers = ruleset.userPermissions.map((p: any) => ({
    user: {
      ...p.user,
      avatarSrc: p.user.avatar?.src,
    },
    shelved: p.shelved,
    permission: p.type,
  }));

  const currentUserPermission = permittedUsers.find((p: any) => p.user.id === userId);

  if (!currentUserPermission) {
    // Official content doesn't hold permissions but is always readable.
    // If the user isn't permitted to view this content otherwise, the ID won't be in userPermittedPublishedRulesetReadIds.
    return [];
  }

  // If this user doesn't own the ruleset, return only their permission
  if (currentUserPermission?.permission !== 'OWNER') {
    return [currentUserPermission];
  }

  return permittedUsers;
};
