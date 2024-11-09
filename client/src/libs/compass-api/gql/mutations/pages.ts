import { gql } from '@apollo/client/core/index.js';

export const createPage = gql`
  mutation CreatePage($input: CreatePage!) {
    createPage(input: $input) {
      id
      rulesetId
      sheetId
      title
      sortIndex
      details
      content
      parentId
    }
  }
`;
export const createPageTemplate = gql`
  mutation CreatePageTemplate($input: CreatePageTemplate!) {
    createPageTemplate(input: $input) {
      id
      rulesetId
      rulesetTitle
      type
      templateId
      templateName
      templateType
      username
      version
      title
      description
      image {
        id
        src
        name
        sortIndex
        parentId
        details
      }
      details
    }
  }
`;
export const updatePage = gql`
  mutation UpdatePage($input: UpdatePage!) {
    updatePage(input: $input) {
      id
      rulesetId
      sheetId
      title
      sortIndex
      details
      content
      parentId
    }
  }
`;

export const updatePages = gql`
  mutation UpdatePages($input: [UpdatePage!]!) {
    updatePages(input: $input) {
      id
      rulesetId
      sheetId
      title
      details
      content
      sortIndex
      parentId
    }
  }
`;

export const deletePage = gql`
  mutation DeletePage($input: DeleteEntity!) {
    deletePage(input: $input)
  }
`;
