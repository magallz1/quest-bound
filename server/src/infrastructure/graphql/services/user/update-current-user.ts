import { dbClient } from '@/database';
import { CurrentUserUpdateInput } from '@/infrastructure/graphql';
import { AuthorizationContext, ResolverInput } from '@/infrastructure/types';

/**
 * Updates the current user and associated companion
 */
export const updateCurrentUser = async (
  parent: any,
  args: ResolverInput<CurrentUserUpdateInput>,
  context: AuthorizationContext,
) => {
  const { userId } = context;

  const db = dbClient();

  const { input } = args;

  const updatedUser = await db.user.update({
    where: {
      id: userId,
    },
    include: {
      companion: true,
      avatar: true,
    },
    data: {
      username: input.username ?? undefined,
      onboarded: input.onboarded ?? undefined,
      preferences: input.preferences ?? undefined,
      companion: {
        update: {
          name: input.companion?.name,
          description: input.companion?.description,
          animal: input.companion?.animal,
          color: input.companion?.color,
          model: input.companion?.model ?? undefined,
        },
      },
      avatarId: input.avatarId,
    },
  });

  return {
    ...updatedUser,
    avatarSrc: updatedUser.avatar?.src,
  };
};
