import { makeVar } from '@apollo/client/core/index.js';
import { useReactiveVar } from '@apollo/client/react/index.js';
import { Session } from '@supabase/supabase-js';
import { useContext, useEffect, useState } from 'react';
import { SupabaseContext } from '../../provider';

const tokenVar = makeVar<string | null>(null);

/**
 * Pulls Supabase session token from cookies and sets it in cache when currentUser changes.
 * Gives the ApolloProvider reactive access to the token to pass in auth headers.
 */
export const useSessionToken = () => {
  const { client } = useContext(SupabaseContext);

  const token = useReactiveVar(tokenVar);
  const [session, setSession] = useState<Session | null>(null);

  const setToken = (token: string | null) => {
    tokenVar(token);
  };

  useEffect(() => {
    client.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setToken(session?.access_token ?? null);
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setToken(session?.access_token ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    token,
    setToken,
    session,
  };
};
