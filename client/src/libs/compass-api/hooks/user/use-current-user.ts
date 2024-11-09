import { debugLog } from '@/libs/compass-web-utils';
import { useApolloClient } from '@apollo/client/index.js';
import { useEffect, useRef } from 'react';
import { currentUser, CurrentUserQuery, UserRole } from '../../gql';
import { useQuery } from '../../utils';
import { useError } from '../metrics';
import { useSessionToken } from './use-session-token';

const debug = debugLog('API', 'useCurrentUser');

export const useCurrentUser = (pollInterval = 0) => {
  const client = useApolloClient();

  const { token } = useSessionToken();

  const attemptedLogin = useRef<boolean>(false);

  const { data, loading, error } = useQuery<CurrentUserQuery>(currentUser, {
    skip: !token || attemptedLogin.current,
    pollInterval,
  });

  useEffect(() => {
    if (error) {
      attemptedLogin.current = true;
    }
  }, [data, error]);

  useError({
    error,
    message: 'Unable to get current user. Please try again.',
    status: 'error',
  });

  const revokeCurrentUser = () => {
    client.resetStore();
  };

  return {
    currentUser: data?.currentUser ?? null,
    isCreator: data?.currentUser?.role === UserRole.CREATOR,
    error,
    maxPlayers: 20,
    revokeCurrentUser,
    loading,
  };
};
