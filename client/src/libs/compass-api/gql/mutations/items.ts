import { gql } from '@apollo/client/core/index.js';

export const createItem = gql`
  mutation CreateItem($input: CreateItem!) {
    createItem(input: $input) {
      id
      title
      moduleTitle
      source
      description
      rulesetId
      attributeData
      category
      sortChildId
      height
      width
      weight
      stackCapacity
      isContainer
      containerHeight
      containerWidth
      containerCapacity
      image {
        id
        src
      }
      logic
    }
  }
`;

export const updateItem = gql`
  mutation UpdateItem($input: UpdateItem!) {
    updateItem(input: $input) {
      id
      title
      moduleTitle
      source
      description
      attributeData
      parentId
      rulesetId
      category
      sortChildId
      height
      width
      weight
      stackCapacity
      isContainer
      containerHeight
      containerWidth
      containerCapacity
      image {
        id
        src
      }
      logic
    }
  }
`;

export const deleteItem = gql`
  mutation DeleteItem($input: DeleteEntity!) {
    deleteItem(input: $input)
  }
`;
