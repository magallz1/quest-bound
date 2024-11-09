import { useParams } from 'react-router-dom';
import {
  bootstrapRulebook as bootstrapRulebookMutation,
  BootstrapRulebookMutation,
  BootstrapRulebookMutationVariables,
  Document,
  pages,
} from '../../gql';
import { useMutation } from '../../utils';
import { useError } from '../metrics';

export const useBootstrapRulebook = () => {
  const { rulesetId } = useParams();

  const [mutation, { loading, error }] = useMutation<
    BootstrapRulebookMutation,
    BootstrapRulebookMutationVariables
  >(bootstrapRulebookMutation);

  useError({
    error,
    message: `Failed to bootstrap rulebook. ${error?.message ?? ''}`,
  });

  const bootstrapRulebook = async (document: Document): Promise<string> => {
    if (!rulesetId) return '';
    await mutation({
      variables: {
        input: {
          rulesetId,
          id: document.id,
        },
      },
      refetchQueries: [{ query: pages, variables: { rulesetId } }],
    });

    return 'success';
  };

  return {
    bootstrapRulebook,
    loading: loading,
    error,
  };
};
