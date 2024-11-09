import { gql } from '@apollo/client/core/index.js';

export const officialContent = gql`
  query OfficialContent {
    officialContent {
      rulesets {
        id
        createdBy
        createdById
        title
        description
        published
        permissions
        publishedRulesetId
        rulesetPermissions
        details
        image {
          id
          src
          name
          sortIndex
          parentId
          details
        }
      }
      modules {
        id
        createdBy
        createdById
        published
        publishedRulesetId
        title
        permissions
        isModule
        rulesetPermissions
        description
        details
        image {
          id
          src
          name
          sortIndex
          parentId
          details
        }
      }
    }
  }
`;
