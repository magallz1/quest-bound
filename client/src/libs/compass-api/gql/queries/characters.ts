import { gql } from '@apollo/client/core/index.js';

export const characters = gql`
  query Characters {
    characters {
      id
      name
      rulesetId
      rulesetTitle
      image {
        id
        src
      }
    }
  }
`;

export const character = gql`
  query Character($id: String!) {
    character(id: $id) {
      id
      name
      rulesetId
      attributeData
      itemData
      streamTabId
      createdFromPublishedRuleset
      image {
        id
        src
      }
      sheet {
        id
        templateId
        rulesetId
        tabs
        details
      }
      pages {
        id
        rulesetId
        details
        content
        title
        sortIndex
        parentId
      }
      attributes {
        id
        name
        moduleTitle
        description
        type
        logic
        defaultValue
        image {
          id
          src
        }
        data
        rulesetId
      }
    }
  }
`;

export const streamCharacter = gql`
  subscription StreamCharacter($id: String!) {
    streamCharacter(id: $id) {
      id
      name
      rulesetId
      attributeData
      itemData
      streamTabId
      createdFromPublishedRuleset
      image {
        id
        src
      }
      attributes {
        id
        name
        moduleTitle
        description
        type
        logic
        defaultValue
        image {
          id
          src
        }
        data
        rulesetId
      }
    }
  }
`;
