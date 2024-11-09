import { gql } from '@apollo/client/core/index.js';

export const images = gql`
  query Images {
    images {
      id
      src
      name
      parentId
      details
      sortIndex
    }
  }
`;
