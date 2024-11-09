import { gql } from '@apollo/client/core/index.js';

export const createSheet = gql`
  mutation CreateSheet($input: CreateSheet!) {
    createSheet(input: $input) {
      id
      type
      rulesetId
      rulesetTitle
      templateId
      templateName
      username
      version
      title
      description
      image {
        id
        src
        name
      }
      tabs
      details
    }
  }
`;

export const updateSheet = gql`
  mutation UpdateSheet($input: UpdateSheet!) {
    updateSheet(input: $input) {
      id
      type
      templateId
      templateName
      rulesetId
      rulesetTitle
      username
      version
      title
      description
      image {
        id
        src
        name
      }
      backgroundImage {
        id
        src
        name
      }
      tabs
      details
    }
  }
`;
export const deleteSheet = gql`
  mutation DeleteSheet($input: DeleteEntity!) {
    deleteSheet(input: $input)
  }
`;

export const shareSheet = gql`
  mutation ShareSheet($input: CreateShareSheet!) {
    shareSheet(input: $input) {
      username
      email
      avatarSrc
      preferences {
        emailShares
      }
    }
  }
`;

export const removeShareSheet = gql`
  mutation RemoveShareSheet($input: CreateShareSheet!) {
    removeSharedSheet(input: $input)
  }
`;
