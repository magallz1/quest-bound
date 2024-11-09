import { gql } from '@apollo/client/core/index.js';

export const charts = gql`
  query Charts($rulesetId: String!) {
    charts(rulesetId: $rulesetId) {
      id
      rulesetId
      title
      fileKey
      data
    }
  }
`;

export const chart = gql`
  query Chart($input: GetEntity!) {
    chart(input: $input) {
      id
      rulesetId
      title
      fileKey
      data
    }
  }
`;
