import { gql } from '@apollo/client/core/index.js';

export const page = gql`
  query Page($input: GetEntity!) {
    page(input: $input) {
      id
      rulesetId
      sheetId
      archetypeId
      title
      details
      parentId
      sortIndex
      sheet {
        id
        type
        templateId
        rulesetId
        rulesetTitle
        templateName
        username
        version
        title
        description
        image {
          id
          src
          name
        }
        backgroundImage {
          id
          src
          name
        }
        tabs
        details
      }
    }
  }
`;

export const pages = gql`
  query Pages($rulesetId: String!) {
    pages(rulesetId: $rulesetId) {
      id
      rulesetId
      sheetId
      archetypeId
      title
      details
      parentId
      sortIndex
    }
  }
`;

export const pageTemplates = gql`
  query PageTemplates($rulesetId: String!) {
    pageTemplates(rulesetId: $rulesetId) {
      id
      type
      templateId
      rulesetId
      rulesetTitle
      templateName
      username
      version
      title
      description
      image {
        id
        src
        name
      }
      backgroundImage {
        id
        src
        name
      }
      tabs
      details
    }
  }
`;
