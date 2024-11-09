import { useNotifications } from '@/stores';
import { useState } from 'react';
import {
  DeletePublishedRulesetMutation,
  deletePublishedRulesetMutation,
  DeletePublishedRulesetMutationVariables,
  PublishRuleset,
  PublishRulesetMutation,
  publishRulesetMutation,
  PublishRulesetMutationVariables,
  Ruleset,
  UpdatePublishedRuleset,
  updatePublishedRulesetMutation,
  UpdatePublishedRulesetMutation,
  UpdatePublishedRulesetMutationVariables,
} from '../../gql';
import { useApolloHelpers, useMutation } from '../../utils';
import { useError } from '../metrics';
import { useCurrentUser } from '../user';
import { useRulesetPermittedUsers } from './use-ruleset-permitted-users';

export type RulesetDetails = {
  live?: boolean;
  includesAI?: boolean;
  includesPDF?: boolean;
  explicit?: boolean;
};

export const usePublishRuleset = () => {
  const [mutation, { loading, error }] = useMutation<
    PublishRulesetMutation,
    PublishRulesetMutationVariables
  >(publishRulesetMutation);

  const [deleteMutation, { error: deleteError }] = useMutation<
    DeletePublishedRulesetMutation,
    DeletePublishedRulesetMutationVariables
  >(deletePublishedRulesetMutation);

  const [updateMutation, { loading: updating, error: updateError }] = useMutation<
    UpdatePublishedRulesetMutation,
    UpdatePublishedRulesetMutationVariables
  >(updatePublishedRulesetMutation);

  const { currentUser } = useCurrentUser();
  const { getPermittedUsers, addPermittedUser } = useRulesetPermittedUsers();

  const { addNotification } = useNotifications();

  const { getOptimisticResponse } = useApolloHelpers();

  const [bumpLoading, setBumpLoading] = useState<boolean>(false);

  useError({
    error,
    message: 'Failed to publish ruleset',
  });

  useError({
    error: deleteError,
    message: 'Failed to sync ruleset',
  });

  const publishRuleset = async (input: PublishRuleset) => {
    const res = await mutation({
      variables: {
        input,
      },
    });

    if (!res.data?.publishRuleset) {
      throw Error('Failed to publish ruleset');
    }

    return res.data.publishRuleset;
  };

  const updatePublishedRuleset = async (input: UpdatePublishedRuleset) => {
    const res = await updateMutation({
      variables: {
        input,
      },
      optimisticResponse: {
        updatePublishedRuleset: getOptimisticResponse('Ruleset', input) as Ruleset,
      },
    });

    if (!res.data?.updatePublishedRuleset) {
      throw Error('Failed to update published ruleset');
    }

    return res.data.updatePublishedRuleset;
  };

  const bumpRulesetVersion = async (input: PublishRuleset, details?: RulesetDetails) => {
    try {
      setBumpLoading(true);

      const permittedUsers = await getPermittedUsers(input.id);

      // Delete existing published ruleset and create it again from
      // the current ruleset. IDs are the same, so this is deterministic.
      await deleteMutation({
        variables: {
          input: {
            id: input.id,
          },
        },
      });

      await publishRuleset(input);

      // Add Permissions back
      await Promise.all(
        permittedUsers
          // Owner gets added during the create
          .filter((p) => p.user.id !== currentUser?.id)
          .map((permission) =>
            addPermittedUser(
              {
                userId: permission.user.id,
                rulesetId: input.id,
                permission: permission.permission,
                shelved: permission.shelved,
              },
              { sharePreference: false, emailTo: '' },
            ),
          ),
      );

      if (details) {
        await updatePublishedRuleset({
          id: input.id,
          ...details,
        });
      }

      addNotification({
        message: 'Ruleset synced successfully',
        status: 'success',
      });
    } catch {
    } finally {
      setBumpLoading(false);
    }
  };

  return {
    publishRuleset,
    bumpRulesetVersion,
    updatePublishedRuleset,
    loading,
    syncLoading: bumpLoading,
    error,
  };
};
