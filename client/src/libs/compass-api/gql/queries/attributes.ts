import { gql } from '@apollo/client/core/index.js';

export const attributes = gql`
  query Attributes($rulesetId: String!, $page: Int, $type: AttributeType) {
    attributes(rulesetId: $rulesetId, page: $page, type: $type) {
      id
      name
      moduleTitle
      description
      type
      defaultValue
      image {
        id
        src
      }
      data
      rulesetId
      category
      restraints
      source
      sortChildId
    }
  }
`;

export const attributesWithLogic = gql`
  query Attributes($rulesetId: String!, $page: Int, $type: AttributeType) {
    attributes(rulesetId: $rulesetId, page: $page, type: $type) {
      id
      name
      moduleTitle
      description
      type
      defaultValue
      image {
        id
        src
      }
      data
      rulesetId
      logic
      category
      restraints
      source
      sortChildId
    }
  }
`;

export const attribute = gql`
  query Attribute($input: GetEntity!) {
    attribute(input: $input) {
      id
      name
      moduleTitle
      image {
        id
        src
      }
      data
      source
      description
      rulesetId
      type
      defaultValue
      category
      restraints
      logic
      sortChildId
    }
  }
`;

export const attributeFragment = gql`
  fragment AttributeFragment on Attribute {
    id
    name
    moduleTitle
    source
    image {
      id
      src
    }
    description
    rulesetId
    type
    defaultValue
    category
    restraints

    sortChildId
  }
`;
