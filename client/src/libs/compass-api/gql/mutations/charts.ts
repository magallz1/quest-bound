import { gql } from '@apollo/client/core/index.js';

export const createChart = gql`
  mutation CreateChart($input: CreateChart!) {
    createChart(input: $input) {
      id
      rulesetId
      title
      fileKey
    }
  }
`;

export const updateChart = gql`
  mutation UpdateChart($input: UpdateChart!) {
    updateChart(input: $input) {
      id
      rulesetId
      title
      fileKey
    }
  }
`;

export const deleteChart = gql`
  mutation DeleteChart($input: DeleteEntity!) {
    deleteChart(input: $input)
  }
`;
