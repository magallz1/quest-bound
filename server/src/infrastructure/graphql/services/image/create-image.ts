import { dbClient } from '@/database';
import { CreateImage } from '@/infrastructure/graphql';
import { AuthorizationContext, ResolverInput } from '@/infrastructure/types';

export const createImage = async (
  parent: any,
  args: ResolverInput<CreateImage>,
  context: AuthorizationContext,
) => {
  const { userId } = context;
  const { input } = args;

  const db = dbClient();

  const image = await db.image.create({
    data: {
      ...input,
      userId,
      src: input.src ?? undefined,
      sortIndex: input.sortIndex ?? undefined,
      details: input.details ?? undefined,
    },
  });

  return {
    ...image,
    details: image.details ? JSON.stringify(image.details) : undefined,
  };
};
