/* tslint:disable */

/* eslint-disable */
// this is an auto generated file. This will be overwritten
import { gql } from '@apollo/client/core/index.js';

export const currentUser = gql`
  query CurrentUser {
    currentUser {
      id
      email
      username
      avatarSrc
      role
      membershipExpiration
      preferences {
        emailShares
        emailUpdates
        emailUnsubscribe
      }
      storageAllotment
      companion {
        id
        name
        description
        animal
        color
        src
        model
      }
      onboarded
      playtestRulesets {
        id
        title
        createdBy
        image {
          src
        }
      }
      collaboratorRulesets {
        id
        title
        createdBy
        image {
          src
        }
      }
    }
  }
`;

export const searchUsers = gql`
  query SearchUsers($input: SearchUsersInput!) {
    searchUsers(input: $input) {
      id
      email
      username
      avatarSrc
      preferences {
        emailShares
      }
    }
  }
`;

export const earlyAccessUser = gql`
  query EarlyAccessUser($input: EarlyAccessUserInput!) {
    earlyAccessUser(input: $input)
  }
`;
