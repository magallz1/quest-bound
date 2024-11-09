import { dbClient, supabaseClient } from '@/database';
import { AuthorizationContext } from '@/infrastructure/types';

/**
 * Look at all images associated to the user. If it isn't being used, delete it and remove it from storage.
 */
export const clearImages = async (parent: any, args: any, context: AuthorizationContext) => {
  const { userId } = context;

  const db = dbClient();
  const supabase = supabaseClient();

  const images = await db.image.findMany({
    where: {
      userId,
    },
    include: {
      sheetBackgrounds: true,
      companion: true,
      components: true,
      userAvatar: true,
    },
  });

  const promises = [];

  for (const image of images) {
    const associations = [
      ...image.sheetBackgrounds,
      ...image.components,
      image.companion,
      image.userAvatar,
    ].filter((association) => association !== null);

    if (associations.length > 0) continue;

    promises.push(async () => {
      if (!!image.src) {
        const fileKey = image.src.split('/public/images/')[1];
        await supabase.storage.from('images').remove([decodeURIComponent(fileKey)]);
      }

      await db.image.delete({
        where: {
          id: image.id,
        },
      });
    });
  }

  await Promise.all(promises.map((p) => p()));

  return 'success';
};
