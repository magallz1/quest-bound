import { gql } from '@apollo/client/core/index.js';

export const createSheetComponents = gql`
  mutation CreateSheetComponents($input: [CreateSheetComponent!]!) {
    createSheetComponents(input: $input) {
      id
      sheetId
      rulesetId
      type
      label
      description
      locked
      images {
        id
        src
        name
      }
      groupId
      tabId
      layer
      style
      data
      x
      y
      height
      width
      rotation
    }
  }
`;
export const updateSheetComponents = gql`
  mutation UpdateSheetComponents($input: [UpdateSheetComponent!]!) {
    updateSheetComponents(input: $input) {
      failedUpdateIds
    }
  }
`;
export const deleteSheetComponents = gql`
  mutation DeleteSheetComponents($input: [DeleteSheetComponent!]!) {
    deleteSheetComponents(input: $input)
  }
`;

export const createSheetComponentFragment = gql`
  fragment CreateSheetComponent on SheetComponent {
    id
    sheetId
    rulesetId
    type
    label
    description
    locked
    images {
      id
      src
      name
    }
    groupId
    tabId
    layer
    style
    data
    x
    y
    height
    width
    rotation
  }
`;
