import { useParams } from 'react-router-dom';
import {
  CreateDocument,
  createDocument as createDocumentMutation,
  CreateDocumentMutation,
  CreateDocumentMutationVariables,
  documents,
} from '../../gql';
import { useMutation } from '../../utils';
import { useError } from '../metrics';

export const useCreateDocument = () => {
  const { rulesetId } = useParams();
  const [mutation, { loading, error }] = useMutation<
    CreateDocumentMutation,
    CreateDocumentMutationVariables
  >(createDocumentMutation);

  useError({
    error,
    message: 'Failed to create document',
  });

  const createDocument = async (input: Omit<CreateDocument, 'rulesetId'>) => {
    if (!rulesetId) return;
    let fileKey = input.fileKey;

    const res = await mutation({
      variables: {
        input: {
          ...input,
          rulesetId,
          fileKey,
        },
      },
      refetchQueries: [{ query: documents, variables: { rulesetId } }],
      awaitRefetchQueries: true,
    });

    if (!res.data?.createDocument) {
      throw Error('Failed to create document');
    }

    return res.data.createDocument;
  };

  return {
    createDocument,
    loading,
    error,
  };
};
