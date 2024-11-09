import { dbClient } from '@/database';
import { UpdateImage } from '@/infrastructure/graphql';
import { AuthorizationContext, ResolverInput } from '@/infrastructure/types';

export const updateImages = async (
  parent: any,
  args: ResolverInput<UpdateImage[]>,
  context: AuthorizationContext,
) => {
  const { userId } = context;

  const { input } = args;

  const db = dbClient();

  const updates = await db.image.findMany({
    where: {
      id: {
        in: input.map((update) => update.id),
      },
    },
  });

  const authorizedUpdates = updates.filter((update: any) => update.userId === userId);

  if (authorizedUpdates.length !== input.length) {
    throw Error('Current user is not authorized to update some of these images.');
  }

  const authorizedTransactions = input.filter((update) =>
    authorizedUpdates.some((authorizedUpdate: any) => authorizedUpdate.id === update.id),
  );

  const res = await Promise.all(
    authorizedTransactions.map((update) =>
      db.image.update({
        where: {
          id: update.id,
        },
        data: {
          ...update,
          name: update.name ?? undefined,
          sortIndex: update.sortIndex ?? undefined,
          details: update.details ?? undefined,
        },
      }),
    ),
  );

  return res.map((image) => ({
    ...image,
    details: image.details ? JSON.stringify(image.details) : undefined,
  }));
};
