import { dbClient } from '@/database';
import { UpdateImage } from '@/infrastructure/graphql';
import { AuthorizationContext, ResolverInput } from '@/infrastructure/types';

export const updateImage = async (
  parent: any,
  args: ResolverInput<UpdateImage>,
  context: AuthorizationContext,
) => {
  const { userId } = context;

  const { input } = args;

  const db = dbClient();

  const existingImage = await db.image.findUnique({
    where: {
      id: input.id,
      userId,
    },
  });

  if (!existingImage) {
    throw Error('Image not found.');
  }

  const image = await db.image.update({
    where: {
      id: input.id,
    },
    data: {
      ...input,
      name: input.name ?? undefined,
      sortIndex: input.sortIndex ?? undefined,
      details: input.details ?? undefined,
    },
  });

  return {
    ...image,
    details: image.details ? JSON.stringify(image.details) : undefined,
  };
};
