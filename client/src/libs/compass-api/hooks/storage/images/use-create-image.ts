import { useContext } from 'react';
import {
  CreateImage,
  createImage as createImageMutation,
  CreateImageMutation,
  CreateImageMutationVariables,
  images,
} from '../../../gql';
import { SupabaseContext } from '../../../provider';
import { useMutation } from '../../../utils';
import { useError } from '../../metrics';
import { useGetImages } from './use-get-images';

export const useCreateImage = () => {
  const [mutation, { error, loading }] = useMutation<
    CreateImageMutation,
    CreateImageMutationVariables
  >(createImageMutation);

  const { host } = useContext(SupabaseContext);

  const { images: existingImages } = useGetImages();

  const createImage = async (input: CreateImage) => {
    if (!input.src?.includes('questbound.com') && !input.src?.includes(host)) {
      // Added from URL
      // No need to create a new image.
      const existingImageWithSrc = existingImages.find((image) => image.src === input.src);

      if (existingImageWithSrc) {
        return existingImageWithSrc;
      }
    }

    const res = await mutation({
      variables: {
        input,
      },
      refetchQueries: [images],
      awaitRefetchQueries: true,
    });

    if (!res.data?.createImage) {
      throw new Error('Failed to create image.');
    }

    return res.data.createImage;
  };

  useError({
    error,
    message: 'Failed to create image.',
    location: 'useCreateDirectory',
  });

  return {
    createImage,
    loading,
  };
};
