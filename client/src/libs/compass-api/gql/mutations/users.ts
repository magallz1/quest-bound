/* tslint:disable */

/* eslint-disable */
// this is an auto generated file. This will be overwritten
import { gql } from '@apollo/client/core/index.js';

export const updateCurrentUser = gql`
  mutation UpdateCurrentUser($input: CurrentUserUpdateInput!) {
    updateCurrentUser(input: $input) {
      id
      username
      onboarded
      avatarSrc
      preferences {
        emailShares
        emailUpdates
        emailUnsubscribe
      }
      companion {
        id
        name
        description
        animal
        color
        src
        model
      }
    }
  }
`;
