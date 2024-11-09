import {
  updateCurrentUser as updateCurrentUserMutation,
  UpdateCurrentUserMutation,
  UpdateCurrentUserMutationVariables,
} from '../../gql';
import { useMutation } from '../../utils';
import { useEmail } from '../email';
import { useError } from '../metrics';

export const useUpdateCurrentUser = () => {
  const { setPreferences } = useEmail();

  const [mutation, { loading, error }] = useMutation<
    UpdateCurrentUserMutation,
    UpdateCurrentUserMutationVariables
  >(updateCurrentUserMutation);

  useError({
    error,
    message: 'Failed to update user',
    location: 'useUpdateCurrentUser',
  });

  const updateCurrentUser = async (input: UpdateCurrentUserMutationVariables) => {
    const res = await mutation({
      variables: {
        ...input,
      },
    });

    const updateIncludesPrefs = !!input.input.preferences;
    const userPrefs = res.data?.updateCurrentUser.preferences;

    if (updateIncludesPrefs && userPrefs) {
      const subscribeToUpdates = !userPrefs.emailUnsubscribe && userPrefs.emailUpdates;
      setPreferences({ subscribeToUpdates });
    }

    return res.data;
  };

  return {
    updateCurrentUser,
    error,
    loading,
  };
};
