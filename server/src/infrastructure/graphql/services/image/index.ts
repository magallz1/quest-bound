import { createImage } from './create-image';
import { deleteImage } from './delete-image';
import { images } from './images';
import { updateImage } from './update-image';
import { updateImages } from './update-images';
import { clearImages } from './clear-images';

export const imageResolvers = {
  Query: {
    images,
  },
  Mutation: {
    createImage,
    clearImages,
    updateImage,
    updateImages,
    deleteImage,
  },
};
