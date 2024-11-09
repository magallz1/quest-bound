import { dbClient, supabaseClient } from '@/database';
import { DeleteImage } from '@/infrastructure/graphql';
import { AuthorizationContext, ResolverInput } from '@/infrastructure/types';

export const deleteImage = async (
  parent: any,
  args: ResolverInput<DeleteImage>,
  context: AuthorizationContext,
) => {
  const { userId } = context;

  const { id } = args.input;

  const db = dbClient();
  const supabase = supabaseClient();

  const image = await db.image.findUnique({
    where: {
      id,
    },
    include: {
      sheetBackgrounds: true,
      companion: true,
      components: true,
      userAvatar: true,
    },
  });

  if (!image) {
    throw Error('Image not found.');
  }

  if (image.userId !== userId) {
    throw Error('Current user is not authorized to delete this image.');
  }

  const associations = [
    ...image.sheetBackgrounds,
    ...image.components,
    image.companion,
    image.userAvatar,
  ].filter((association) => association !== null);

  // Only delete an image if it isn't associated to anything else
  // Otherwise, mark it as hidden

  if (associations.length > 0) {
    await db.image.update({
      where: {
        id,
      },
      data: {
        hidden: true,
      },
    });
  } else {
    await db.image.delete({
      where: {
        id,
      },
    });

    if (!!image.src) {
      const fileKey = image.src.split('/public/images/')[1];
      await supabase.storage.from('images').remove([decodeURIComponent(fileKey)]);
    }
  }

  return {
    safeToDeleteFile: false,
    fileKey: '',
  };
};
