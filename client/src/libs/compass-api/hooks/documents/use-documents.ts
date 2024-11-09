import { useParams } from 'react-router-dom';
import { Document, documents, DocumentsQuery, DocumentsQueryVariables } from '../../gql';
import { useQuery } from '../../utils';
import { useError } from '../metrics';

export const useDocuments = () => {
  const { rulesetId } = useParams();
  const { data, loading, error } = useQuery<DocumentsQuery, DocumentsQueryVariables>(documents, {
    variables: {
      rulesetId: rulesetId ?? '',
    },
    skip: !rulesetId,
  });

  useError({
    error,
    message: 'Failed to load documents',
  });

  return {
    documents: (data?.documents ?? []) as Document[],
    loading,
    error,
  };
};
