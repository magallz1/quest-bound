import { gql } from '@apollo/client/core/index.js';

export const createCharacter = gql`
  mutation CreateCharacter($input: CreateCharacter!) {
    createCharacter(input: $input) {
      id
      name
      rulesetId
    }
  }
`;

export const deleteCharacter = gql`
  mutation DeleteCharacter($id: String!) {
    deleteCharacter(id: $id)
  }
`;

export const updateCharacter = gql`
  mutation UpdateCharacter($input: UpdateCharacter!) {
    updateCharacter(input: $input) {
      id
      name
      attributeData
    }
  }
`;
