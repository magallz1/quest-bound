import { dbClient } from '@/database';
import { Image } from '@/infrastructure/graphql';
import { AuthorizationContext, ResolverInput } from '@/infrastructure/types';

export const images = async (
  parent: any,
  args: ResolverInput<Image>,
  context: AuthorizationContext,
) => {
  const { userId } = context;
  const db = dbClient();

  const images = await db.user
    .findUnique({
      where: {
        id: userId,
      },
    })
    .images();

  return (images ?? [])
    .filter((img: any) => !img.hidden)
    .map((image: any) => ({
      ...image,
      details: image.details ? JSON.stringify(image.details) : undefined,
    }));
};
