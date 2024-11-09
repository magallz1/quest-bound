import {
  deleteImage as deleteImageMutation,
  DeleteImageMutation,
  DeleteImageMutationVariables,
} from '../../../gql';
import { useMutation } from '../../../utils';
import { useError } from '../../metrics';
import { useCacheHelpers } from '../cache-helpers';
import { useDeleteFile } from '../use-delete-file';

interface DeleteImage {
  id: string;
}

export const useDeleteImage = () => {
  const [mutation, { loading, error }] = useMutation<
    DeleteImageMutation,
    DeleteImageMutationVariables
  >(deleteImageMutation);

  const { deleteFile } = useDeleteFile();
  const { removeImageFromCache } = useCacheHelpers();

  const deleteImage = async ({ id }: DeleteImage) => {
    removeImageFromCache(id);

    const res = await mutation({
      variables: {
        input: {
          id,
        },
      },
    });

    if (!res.data?.deleteImage) throw new Error('Failed to delete image.');

    // Returns true if nothing is associated to this image, such as a sheet component.
    const { safeToDeleteFile, fileKey } = res.data.deleteImage;

    if (safeToDeleteFile) {
      deleteFile({
        bucketName: 'images',
        fileName: fileKey,
      });
    }

    return 'success';
  };

  useError({
    error,
    message: 'Failed to delete image.',
    location: 'useDeleteImage',
  });

  return {
    deleteImage,
    loading,
  };
};
