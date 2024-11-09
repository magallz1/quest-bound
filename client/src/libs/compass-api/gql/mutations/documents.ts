import { gql } from '@apollo/client/core/index.js';

export const createDocument = gql`
  mutation CreateDocument($input: CreateDocument!) {
    createDocument(input: $input) {
      id
      rulesetId
      title
      fileKey
    }
  }
`;

export const updateDocument = gql`
  mutation UpdateDocument($input: UpdateDocument!) {
    updateDocument(input: $input) {
      id
      rulesetId
      title
      fileKey
    }
  }
`;

export const deleteDocument = gql`
  mutation DeleteDocument($input: DeleteEntity!) {
    deleteDocument(input: $input)
  }
`;

export const bootstrapRulebook = gql`
  mutation BootstrapRulebook($input: BootstrapRulebook!) {
    bootstrapRulebook(input: $input)
  }
`;

export const deleteBootstrap = gql`
  mutation DeleteBootstrap($rulesetId: String!) {
    deleteBootstrap(rulesetId: $rulesetId)
  }
`;
