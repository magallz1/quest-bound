import { gql } from '@apollo/client/core/index.js';

export const archetypes = gql`
  query Archetypes($rulesetId: String!) {
    archetypes(rulesetId: $rulesetId) {
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

export const archetype = gql`
  query Archetype($input: GetEntity!) {
    archetype(input: $input) {
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
