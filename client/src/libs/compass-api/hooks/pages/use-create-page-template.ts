import { useParams } from 'react-router-dom';
import {
  CreatePageTemplate,
  createPageTemplate as createPageTemplateMutation,
  CreatePageTemplateMutation,
  CreatePageTemplateMutationVariables,
  pageTemplates,
} from '../../gql';
import { useMutation } from '../../utils';
import { useError } from '../metrics';

export const useCreatePageTemplate = () => {
  const { rulesetId } = useParams();

  const [mutation, { loading, error }] = useMutation<
    CreatePageTemplateMutation,
    CreatePageTemplateMutationVariables
  >(createPageTemplateMutation, {
    refetchQueries: [{ query: pageTemplates, variables: { rulesetId } }],
    awaitRefetchQueries: true,
  });

  useError({
    error,
    message: 'Failed to create page template',
  });

  const createPageTemplateFromPage = async ({
    pageId,
    title,
    description,
  }: Omit<CreatePageTemplate, 'rulesetId'>) => {
    if (!rulesetId) return;
    const res = await mutation({
      variables: {
        input: {
          pageId,
          rulesetId,
          title,
          description,
        },
      },
    });

    if (!res.data?.createPageTemplate) {
      throw Error('Failed to create page template');
    }

    return res.data.createPageTemplate;
  };

  return {
    createPageTemplateFromPage,
    loading,
    error,
  };
};
