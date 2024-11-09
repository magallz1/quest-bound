import { gql } from '@apollo/client/core/index.js';

export const sheetTemplates = gql`
  query SheetTemplates($rulesetId: String!, $published: Boolean = false) {
    sheetTemplates(rulesetId: $rulesetId, published: $published) {
      id
      type
      templateId
      rulesetId
      rulesetTitle
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
      }
      details
    }
  }
`;

export const sheet = gql`
  query Sheet($input: GetEntity!) {
    sheet(input: $input) {
      id
      pageId
      type
      templateId
      rulesetId
      templateType
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

export const sheetFragment = gql`
  fragment SheetFragment on Sheet {
    id
    type
    templateId
    rulesetId
    templateType
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
`;
