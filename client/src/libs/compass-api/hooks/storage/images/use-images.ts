import { CreateImage, Image, UpdateImage } from '../../../gql';
import { useCreateImage } from './use-create-image';
import { FileResponse, useCreateImages } from './use-create-images';
import { useDeleteImage } from './use-delete-image';
import { useGetImages } from './use-get-images';
import { useUpdateImages } from './use-update-image';

interface UseImages {
  getLoading: boolean;
  uploadLoading: boolean;
  deleteLoading: boolean;
  sizeLoading: boolean;
  images: Image[];
  createImage: (input: CreateImage) => Promise<Image>;
  createImages: (files: FileResponse[], parentId?: string) => Promise<Image[]>;
  updateImage: (update: UpdateImage) => void;
  deleteImage: (filePath: string) => Promise<string>;
}

export const useImages = (): UseImages => {
  const { images, refetch, loading: getLoading } = useGetImages();
  const { createImages, loading: uploadLoading } = useCreateImages();
  const { updateImage, loading: updateLoading } = useUpdateImages();
  const { createImage, loading: createLoading } = useCreateImage();
  const { deleteImage, loading: deleteLoading } = useDeleteImage();

  const handleUpload = async (files: FileResponse[], parentId?: string) => {
    const res = await createImages({ files, parentId });
    return res;
  };

  const handleUpdate = (update: UpdateImage) => {
    updateImage(update);
  };

  const handleDelete = async (id: string) => {
    await deleteImage({ id });
    await refetch();
    return 'success';
  };

  return {
    images,
    getLoading,
    uploadLoading,
    deleteLoading,
    sizeLoading: uploadLoading || deleteLoading || getLoading || updateLoading,
    createImage,
    createImages: handleUpload,
    updateImage: handleUpdate,
    deleteImage: handleDelete,
  };
};
