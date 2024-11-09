import {
  UpdateImage,
  updateImages as updateImagesMutation,
  UpdateImagesMutation,
  UpdateImagesMutationVariables,
} from '../../../gql';
import { useMutation } from '../../../utils';
import { useError } from '../../metrics';
import { useCacheHelpers } from '../cache-helpers';

export type ImageUpdateRequest = {
  currentPath: string;
  newPath: string;
};

export const useUpdateImages = () => {
  const [mutation, { loading, error }] = useMutation<
    UpdateImagesMutation,
    UpdateImagesMutationVariables
  >(updateImagesMutation);

  const { updateImageCacheOnly } = useCacheHelpers();

  const updateImage = async (update: UpdateImage) => {
    const imagesWithUpdates = updateImageCacheOnly(update);

    if (!imagesWithUpdates.length) return [];
    const res = await mutation({
      variables: {
        input: imagesWithUpdates,
      },
    });

    return res.data?.updateImages ?? [];
  };

  useError({
    error,
    message: 'Failed to update image.',
    location: 'useUpdateImages',
  });

  return {
    updateImage,
    loading,
  };
};
