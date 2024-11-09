import { toBase64 } from '@/libs/compass-web-utils';
import { useContext, useState } from 'react';
import { createImage, CreateImageMutation, CreateImageMutationVariables } from '../../../gql';
import { SupabaseContext } from '../../../provider';
import { useMutation } from '../../../utils';
import { useError } from '../../metrics';
import { useCacheHelpers } from '../cache-helpers';

export type FileResponse = {
  file: File;
  fileName: string;
  fileKey: string;
};

type UploadImagesRequest = {
  files: FileResponse[];
  parentId?: string;
};

export const useCreateImages = () => {
  const { addImageToCache, getCachedImages } = useCacheHelpers();
  const [loading, setLoading] = useState(false);
  const { host } = useContext(SupabaseContext);

  const [createImageMutation, { error }] = useMutation<
    CreateImageMutation,
    CreateImageMutationVariables
  >(createImage);

  // Images are always uploaded through a user's image gallery (i.e. associated to a user through userId)
  const createImages = async ({ files, parentId }: UploadImagesRequest) => {
    const promises = [];
    setLoading(true);
    try {
      for (const file of files) {
        const fileSrc = encodeURIComponent(file.fileKey);
        promises.push(async () => {
          const base64 = await toBase64(file.file);
          const imageRes = await createImageMutation({
            variables: {
              input: {
                name: file.fileName,
                src: `${host}/storage/v1/object/public/images/${fileSrc}`,
                parentId,
                details: base64.slice(0, 1000),
              },
            },
          });

          if (imageRes.data) {
            addImageToCache(imageRes.data.createImage);
          }
        });
      }

      await Promise.all(promises.map((promise) => promise()));
      setLoading(false);

      return getCachedImages();
    } catch (e) {
      setLoading(false);
      return [];
    }
  };

  useError({
    error,
    message: 'Failed to upload images.',
    location: 'useCreateImages',
  });

  return {
    createImages,
    loading,
  };
};
