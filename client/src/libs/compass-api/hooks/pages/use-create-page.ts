import { generateId } from '@/libs/compass-web-utils';
import { useParams } from 'react-router-dom';
import {
  character,
  CreatePage,
  createPage as createPageMutation,
  CreatePageMutation,
  CreatePageMutationVariables,
  pages,
} from '../../gql';
import { useMutation } from '../../utils';
import { useError } from '../metrics';

export const useCreatePage = () => {
  const { rulesetId, characterId } = useParams();

  const [mutation, { loading, error }] = useMutation<
    CreatePageMutation,
    CreatePageMutationVariables
  >(createPageMutation, {
    refetchQueries: characterId
      ? [
          { query: pages, variables: { rulesetId } },
          { query: character, variables: { id: characterId } },
        ]
      : [{ query: pages, variables: { rulesetId } }],
  });

  useError({
    error,
    message: 'Failed to create page',
  });

  const createPage = async (input: Omit<CreatePage, 'rulesetId'>) => {
    if (!rulesetId) return;
    const id = generateId();

    const res = await mutation({
      variables: {
        input: {
          id,
          ...input,
          rulesetId,
          characterId: input.characterId || undefined,
        },
      },
    });

    if (!res.data?.createPage) {
      throw Error('Failed to create page');
    }

    return res.data.createPage;
  };

  return {
    createPage,
    loading,
    error,
  };
};
