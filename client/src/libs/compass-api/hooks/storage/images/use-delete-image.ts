import {
  deleteImage as deleteImageMutation,
  DeleteImageMutation,
  DeleteImageMutationVariables,
} from '../../../gql';
import { useMutation } from '../../../utils';
import { useError } from '../../metrics';
import { useCacheHelpers } from '../cache-helpers';

interface DeleteImage {
  id: string;
}

export const useDeleteImage = () => {
  const [mutation, { loading, error }] = useMutation<
    DeleteImageMutation,
    DeleteImageMutationVariables
  >(deleteImageMutation);

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
