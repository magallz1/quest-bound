import { toBase64 } from '@/libs/compass-web-utils';
import { useState } from 'react';
import { createImage, CreateImageMutation, CreateImageMutationVariables } from '../../../gql';
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

  const [createImageMutation, { error }] = useMutation<
    CreateImageMutation,
    CreateImageMutationVariables
  >(createImage);

  const createImages = async ({ files, parentId }: UploadImagesRequest) => {
    const promises = [];
    setLoading(true);
    try {
      for (const file of files) {
        const fileSrc = file.fileKey.replace(/ /g, '-');
        promises.push(async () => {
          const base64 = await toBase64(file.file);
          const imageRes = await createImageMutation({
            variables: {
              input: {
                name: file.fileName,
                src: fileSrc,
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
