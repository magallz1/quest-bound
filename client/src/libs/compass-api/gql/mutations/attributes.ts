import { gql } from '@apollo/client/core/index.js';

export const createAttribute = gql`
  mutation CreateAttribute($input: CreateAttribute!) {
    createAttribute(input: $input) {
      id
      rulesetId
      name
      description
      type
      defaultValue
      category
      restraints
      logic
      image {
        id
        src
      }
    }
  }
`;

export const updateAttribute = gql`
  mutation UpdateAttribute($input: UpdateAttribute!) {
    updateAttribute(input: $input) {
      id
      rulesetId
      name
      description
      image {
        id
        src
      }
      type
      defaultValue
      category
      restraints
      logic
    }
  }
`;

export const updateAttributeOrder = gql`
  mutation UpdateAttributeOrder($input: UpdateAttributeOrder!) {
    updateAttributeOrder(input: $input)
  }
`;

export const deleteAttribute = gql`
  mutation DeleteAttribute($input: DeleteEntity!) {
    deleteAttribute(input: $input)
  }
`;
