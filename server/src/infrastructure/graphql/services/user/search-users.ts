import { dbClient } from '@/database';
import { SearchUsersInput } from '@/infrastructure/graphql';
import { AuthorizationContext, ResolverInput } from '@/infrastructure/types';

/**
 * Searches for users by email or username
 *
 */
export const searchUsers = async (
  parent: any,
  args: ResolverInput<SearchUsersInput>,
  context: AuthorizationContext,
) => {
  const db = dbClient();
  const { input } = args;

  const results = await db.user.findMany({
    where: {
      OR: [
        {
          email: {
            mode: 'insensitive',
            equals: input.email ?? undefined,
          },
        },
        {
          username: {
            mode: 'insensitive',
            equals: input.username ?? undefined,
          },
        },
      ],
    },
    include: {
      avatar: {
        select: {
          src: true,
        },
      },
    },
  });

  return results.map((result: any) => ({
    ...result,
    avatarSrc: result.avatar?.src ?? null,
  }));
};
