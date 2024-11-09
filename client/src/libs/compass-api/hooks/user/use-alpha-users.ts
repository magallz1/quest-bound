import { earlyAccessUser, EarlyAccessUserQuery, EarlyAccessUserQueryVariables } from '../../gql';
import { useError } from '../../index';
import { useLazyQuery } from '../../utils';

export const useAlphaUsers = () => {
  const [query, { loading, error }] = useLazyQuery<
    EarlyAccessUserQuery,
    EarlyAccessUserQueryVariables
  >(earlyAccessUser, { fetchPolicy: 'network-only' });

  useError({
    error: error,
    message: 'Failed to determine early access status.',
  });

  const isAlphaUser = async (email: string): Promise<boolean> => {
    const res = await query({
      variables: {
        input: {
          email,
        },
      },
    });

    return res.data?.earlyAccessUser === 'true';
  };

  return {
    isAlphaUser,
    loading,
    error,
  };
};
