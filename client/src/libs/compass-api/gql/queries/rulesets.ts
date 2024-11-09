import { gql } from '@apollo/client/core/index.js';

export const ruleset = gql`
  query Ruleset($id: String!) {
    ruleset(id: $id) {
      id
      rulesetId
      publishedRulesetId
      published
      live
      includesAI
      includesPDF
      explicit
      version
      permissions
      rulesetPermissions
      isModule
      createdBy
      createdById
      title
      description
      details
      pages {
        id
        parentId
        sortIndex
        rulesetId
      }
      modules {
        id
        title
        createdBy
        description
        image {
          id
          src
          name
        }
      }
      image {
        id
        src
        name
      }
      playtesters {
        id
        username
        email
        avatarSrc
      }
    }
  }
`;

export const rulesets = gql`
  query Rulesets {
    rulesets {
      id
      createdAt
      rulesetId
      userId
      rulesetTitle
      publishedRulesetId
      isModule
      published
      rulesetPermissions
      createdBy
      createdById
      permissions
      modules {
        id
        title
      }
      createdBy
      title
      description
      details
      image {
        id
        src
        name
      }
    }
  }
`;

export const permittedRulesets = gql`
  query PermittedRulesets {
    permittedRulesets {
      id
      createdAt
      userId
      rulesetId
      rulesetTitle
      publishedRulesetId
      permissions
      published
      rulesetPermissions
      createdBy
      createdById
      title
      isModule
      description
      image {
        id
        src
      }
    }
  }
`;

export const permittedUsers = gql`
  query PermittedUsers($id: String!) {
    permittedUsers(id: $id) {
      user {
        id
        username
        avatarSrc
      }
      permission
      shelved
    }
  }
`;

export const rulesetSalesPage = gql`
  query RulesetSalesPage($id: String!) {
    rulesetSalesPage(id: $id) {
      id
      currentUserHasPermission
      includesAI
      includesPDF
      explicit
      live
      shelved
      title
      createdBy
      createdAt
      description
      price
      details
      images {
        id
        src
      }
    }
  }
`;
