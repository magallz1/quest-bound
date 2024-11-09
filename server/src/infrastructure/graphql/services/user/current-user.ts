import { dbClient } from '@/database';
import { AuthorizationContext } from '@/infrastructure/types';
import { isAfter } from 'date-fns';
import { addCreatorTag } from '../../../rest/services/email/add-creator-tag';
import { UserRole } from '../../generated-types';

export const currentUser = async (parent: any, args: any, context: AuthorizationContext) => {
  const { userId } = context;

  const db = dbClient();

  let refetch = false;

  let currentUser = await db.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      companion: true,
      images: true,
      avatar: true,
      playTesters: {
        include: {
          ruleset: {
            include: {
              image: true,
            },
          },
        },
      },
    },
  });

  if (!currentUser) {
    throw Error('User not found');
  }

  if (isAfter(new Date(), new Date(currentUser.membershipExpiration ?? new Date()))) {
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        membershipExpiration: null,
        role: UserRole.USER,
      },
    });

    await addCreatorTag({
      email: currentUser.email,
      formerCreator: true,
    });

    refetch = true;
  }

  if (!currentUser.preferences || !currentUser.preferences.hasOwnProperty('emailUnsubscribe')) {
    refetch = true;
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        preferences: {
          emailUnsubscribe: false,
          emailUpdates: false,
          emailShares: true,
        },
      },
    });
  }

  if (!currentUser.companion) {
    refetch = true;
    await db.companion.create({
      data: {
        name: 'Companion',
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  await db.user.update({
    where: {
      id: userId,
    },
    data: {
      metadata: {
        lastLogin: new Date().toISOString(),
      },
    },
  });

  // For initial bootstrap of user only
  if (refetch) {
    currentUser = await db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        companion: true,
        images: true,
        avatar: true,
        playTesters: {
          include: {
            ruleset: {
              include: {
                image: true,
              },
            },
          },
        },
      },
    });
  }

  if (!currentUser) {
    throw Error('User not found');
  }

  return {
    ...currentUser,
    membershipExpiration: currentUser.membershipExpiration ?? 'never',
    images: currentUser.images.filter((img: any) => !img.hidden),
    avatarSrc: currentUser.avatar?.src ?? null,
    playtestRulesets: currentUser.playTesters.map((pt: any) => ({
      ...pt.ruleset,
      published: false,
      approved: false,
      permissions: [],
    })),
    collaboratorRulesets: currentUser.playTesters
      .filter((pt: any) => pt.permission === 'WRITE')
      .map((pt: any) => ({
        ...pt.ruleset,
        published: false,
        approved: false,
        permissions: [],
      })),
  };
};
