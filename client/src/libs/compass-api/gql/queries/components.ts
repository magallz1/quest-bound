import { gql } from '@apollo/client/core/index.js';

export const sheetComponents = gql`
  query SheetComponents($input: GetSheetComponents!) {
    sheetComponents(input: $input) {
      id
      sheetId
      rulesetId
      type
      label
      description
      locked
      groupId
      tabId
      layer
      style
      data
      x
      y
      height
      width
      rotation
      images {
        id
        src
        name
      }
    }
  }
`;

export const streamComponents = gql`
  subscription StreamComponents($input: GetSheetComponents!) {
    streamComponents(input: $input) {
      id
      sheetId
      rulesetId
      type
      label
      description
      locked
      groupId
      tabId
      layer
      style
      data
      x
      y
      height
      width
      rotation
      images {
        id
        src
        name
      }
    }
  }
`;

export const componentFragment = gql`
  fragment ComponentFragment on SheetComponent {
    id
    sheetId
    rulesetId
    type
    label
    description
    locked
    images {
      id
      src
      name
    }
    groupId
    tabId
    layer
    style
    data
    x
    y
    height
    width
    rotation
  }
`;
