import { gql } from '@apollo/client/core/index.js';

export const createImage = gql`
  mutation CreateImage($input: CreateImage!) {
    createImage(input: $input) {
      id
      src
      name
      sortIndex
      parentId
      details
    }
  }
`;

export const createImages = gql`
  mutation CreateImages($input: [CreateImage!]!) {
    createImages(input: $input) {
      id
      src
      name
      sortIndex
      parentId
      details
    }
  }
`;

export const updateImage = gql`
  mutation UpdateImage($input: UpdateImage!) {
    updateImage(input: $input) {
      id
      src
      name
      sortIndex
      parentId
      details
    }
  }
`;

export const updateImages = gql`
  mutation UpdateImages($input: [UpdateImage!]!) {
    updateImages(input: $input) {
      id
      src
      name
      sortIndex
      parentId
      details
    }
  }
`;

export const deleteImage = gql`
  mutation DeleteImage($input: DeleteImage!) {
    deleteImage(input: $input) {
      safeToDeleteFile
      fileKey
    }
  }
`;
