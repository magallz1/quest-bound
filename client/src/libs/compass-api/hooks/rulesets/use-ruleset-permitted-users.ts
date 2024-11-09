import {
  AddRulesetPermission,
  addRulesetPermission as addRulesetPermissionMutation,
  AddRulesetPermissionMutation,
  AddRulesetPermissionMutationVariables,
  currentUser as currentUserQuery,
  permittedRulesets,
  permittedUsers,
  PermittedUsersQuery,
  PermittedUsersQueryVariables,
  RemoveRulesetPermission,
  removeRulesetPermission as removeRulesetPermissionMutation,
  RemoveRulesetPermissionMutation,
  RemoveRulesetPermissionMutationVariables,
  RulesetPermission,
  updateRulesetPermission,
  UpdateRulesetPermission,
  UpdateRulesetPermissionMutation,
  UpdateRulesetPermissionMutationVariables,
} from '../../gql';
import { useLazyQuery, useMutation, useQuery } from '../../utils';
import { useEmail } from '../email';
import { useError } from '../metrics';
import { useCurrentUser } from '../user';

type EmailDetails = {
  emailTo: string;
  sharePreference: boolean;
  rulesetTitle?: string;
};

/**
 * Returns which users have permissions to a given ruleset
 */
export const useRulesetPermittedUsers = (rulesetId?: string, forceSkip = false) => {
  const { currentUser } = useCurrentUser();
  const { send } = useEmail();
  const { data, loading, error } = useQuery<PermittedUsersQuery, PermittedUsersQueryVariables>(
    permittedUsers,
    {
      variables: {
        id: rulesetId ?? '',
      },
      skip: !rulesetId || forceSkip,
    },
  );

  useError({
    error,
    message: 'Failed to load permitted users',
  });

  const [query] = useLazyQuery<PermittedUsersQuery, PermittedUsersQueryVariables>(permittedUsers);

  const [mutation, { error: addError, loading: addPermittedUserLoading }] = useMutation<
    AddRulesetPermissionMutation,
    AddRulesetPermissionMutationVariables
  >(addRulesetPermissionMutation);

  const [updateMutation, { error: updateError, loading: updatePermissionLoading }] = useMutation<
    UpdateRulesetPermissionMutation,
    UpdateRulesetPermissionMutationVariables
  >(updateRulesetPermission);

  const [removeMutation, { error: removeError, loading: removePermittedUserLoading }] = useMutation<
    RemoveRulesetPermissionMutation,
    RemoveRulesetPermissionMutationVariables
  >(removeRulesetPermissionMutation);

  useError({
    error: addError,
    message: 'Failed to assign permission to ruleset',
  });

  useError({
    error: removeError,
    message: 'Failed to remove permission from user',
  });

  const getPermittedUsers = async (id: string) => {
    const res = await query({
      variables: {
        id,
      },
    });

    return res.data?.permittedUsers ?? [];
  };

  const addPermittedUser = async (
    input: AddRulesetPermission,
    emailDetails?: EmailDetails,
    skipRefetch?: boolean,
  ) => {
    const res = await mutation({
      variables: {
        input,
      },
      refetchQueries: skipRefetch
        ? []
        : [{ query: permittedUsers, variables: { id: input.rulesetId } }],
      awaitRefetchQueries: true,
    });

    if (!res.data?.addRulesetPermission) {
      throw new Error('Failed to add ruleset permission');
    }

    if (emailDetails?.sharePreference) {
      send(emailDetails);
    }

    return res.data?.addRulesetPermission ?? [];
  };

  const updatePermittedUser = async (input: UpdateRulesetPermission) => {
    const res = await updateMutation({
      variables: {
        input,
      },
      refetchQueries: [
        { query: permittedUsers, variables: { id: input.rulesetId } },
        { query: permittedRulesets },
        { query: currentUserQuery },
      ],
      awaitRefetchQueries: true,
    });

    if (!res.data?.updateRulesetPermission) {
      throw new Error('Failed to update ruleset permission');
    }
  };

  const removePermittedUser = async (input: RemoveRulesetPermission) => {
    const isRemovingSelf = input.userId === currentUser?.id;

    const res = await removeMutation({
      variables: {
        input,
      },
      // If removing self from an unowned ruleset, refetching that ruleset's permissions will fail.
      refetchQueries: isRemovingSelf
        ? [{ query: permittedRulesets }]
        : [{ query: permittedUsers, variables: { id: input.rulesetId } }],
      awaitRefetchQueries: true,
    });

    if (!res.data?.removeRulesetPermission) {
      throw new Error('Failed to remove ruleset permission');
    }

    return res.data?.removeRulesetPermission ?? [];
  };

  return {
    permittedUsers: (data?.permittedUsers ?? []) as RulesetPermission[],
    getPermittedUsers,
    addPermittedUser,
    updatePermittedUser,
    removePermittedUser,
    loading,
    addPermittedUserLoading,
    removePermittedUserLoading,
    updatePermissionLoading,
    error,
  };
};
