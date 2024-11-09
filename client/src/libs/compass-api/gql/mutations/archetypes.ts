import { gql } from '@apollo/client/core/index.js';

export const createArchetype = gql`
  mutation CreateArchetype($input: CreateArchetype!) {
    createArchetype(input: $input) {
      id
      rulesetId
      moduleId
      category
      moduleTitle
      title
      description
    }
  }
`;

export const updateArchetype = gql`
  mutation UpdateArchetype($input: UpdateArchetype!) {
    updateArchetype(input: $input) {
      id
      rulesetId
      moduleId
      category
      moduleTitle
      title
      description
      image {
        id
        src
      }
    }
  }
`;

export const deleteArchetype = gql`
  mutation DeleteArchetype($input: DeleteEntity!) {
    deleteArchetype(input: $input)
  }
`;

export const bootstrapArchetypeFile = gql`
  mutation BootstrapArchetypeFile($input: BootstrapArchetypeFile!) {
    bootstrapArchetypeFile(input: $input)
  }
`;
