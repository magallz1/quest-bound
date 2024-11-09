import { useParams } from 'react-router-dom';
import {
  documents,
  UpdateDocument,
  updateDocument as updateDocumentMutation,
  UpdateDocumentMutation,
  UpdateDocumentMutationVariables,
} from '../../gql';
import { useMutation } from '../../utils';
import { useError } from '../metrics';

export const useUpdateDocument = () => {
  const { rulesetId } = useParams();
  const [mutation, { loading, error }] = useMutation<
    UpdateDocumentMutation,
    UpdateDocumentMutationVariables
  >(updateDocumentMutation);

  useError({
    error,
    message: 'Failed to update document',
  });

  const updateDocument = async (input: Omit<UpdateDocument, 'rulesetId'>) => {
    if (!rulesetId) return;
    const res = await mutation({
      variables: {
        input: {
          ...input,
          rulesetId,
        },
      },
      refetchQueries: [{ query: documents, variables: { id: input.id } }],
    });

    if (!res.data?.updateDocument) {
      throw Error('Failed to update document');
    }

    return res.data.updateDocument;
  };

  return {
    updateDocument,
    loading,
    error,
  };
};
