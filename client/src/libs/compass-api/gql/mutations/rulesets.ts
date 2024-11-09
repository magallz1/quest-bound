import { gql } from '@apollo/client/core/index.js';

export const addModule = gql`
  mutation AddModule($input: AddModule!) {
    addModule(input: $input) {
      id
      title
    }
  }
`;

export const removeModule = gql`
  mutation RemoveModule($input: RemoveModule!) {
    removeModule(input: $input) {
      id
      title
    }
  }
`;

export const createRuleset = gql`
  mutation CreateRuleset($input: CreateRuleset!) {
    createRuleset(input: $input) {
      id
      userId
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

export const publishRulesetMutation = gql`
  mutation PublishRuleset($input: PublishRuleset!) {
    publishRuleset(input: $input) {
      id
      published
      version
    }
  }
`;

export const updatePublishedRulesetMutation = gql`
  mutation UpdatePublishedMutation($input: UpdatePublishedRuleset!) {
    updatePublishedRuleset(input: $input) {
      id
      version
      live
      includesAI
      includesPDF
      explicit
    }
  }
`;

export const deletePublishedRulesetMutation = gql`
  mutation DeletePublishedRuleset($input: DeleteRuleset!) {
    deletePublishedRuleset(input: $input)
  }
`;

export const addToShelf = gql`
  mutation AddToShelf($input: AddToShelf!) {
    addToShelf(input: $input) {
      id
    }
  }
`;

export const addRulesetPermission = gql`
  mutation AddRulesetPermission($input: AddRulesetPermission!) {
    addRulesetPermission(input: $input)
  }
`;

export const updateRulesetPermission = gql`
  mutation UpdateRulesetPermission($input: UpdateRulesetPermission!) {
    updateRulesetPermission(input: $input)
  }
`;

export const removeRulesetPermission = gql`
  mutation RemoveRulesetPermission($input: RemoveRulesetPermission!) {
    removeRulesetPermission(input: $input)
  }
`;

export const updateRuleset = gql`
  mutation UpdateRuleset($input: UpdateRuleset!) {
    updateRuleset(input: $input) {
      id
      userId
      createdBy
      title
      description
      details
      isModule
      image {
        id
        src
        name
      }
    }
  }
`;

export const deleteRuleset = gql`
  mutation DeleteRuleset($input: DeleteRuleset!) {
    deleteRuleset(input: $input)
  }
`;

export const addPlaytester = gql`
  mutation AddPlaytester($input: AddPlaytester!) {
    addPlaytester(input: $input)
  }
`;

export const removePlaytester = gql`
  mutation RemovePlaytester($input: RemovePlaytester!) {
    removePlaytester(input: $input)
  }
`;
