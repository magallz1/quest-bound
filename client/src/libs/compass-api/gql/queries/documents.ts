import { gql } from '@apollo/client/core/index.js';

export const documents = gql`
  query Documents($rulesetId: String!) {
    documents(rulesetId: $rulesetId) {
      id
      rulesetId
      title
    }
  }
`;

export const document = gql`
  query Document($input: GetEntity!) {
    document(input: $input) {
      id
      rulesetId
      title
      fileKey
    }
  }
`;
