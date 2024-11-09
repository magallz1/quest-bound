import { useParams } from 'react-router-dom';
import {
  Document,
  document as documentQuery,
  DocumentQuery,
  DocumentQueryVariables,
} from '../../gql';
import { useQuery } from '../../utils';
import { useError } from '../metrics';

export const useDocument = (id?: string) => {
  const { rulesetId } = useParams();

  const { data, error, loading } = useQuery<DocumentQuery, DocumentQueryVariables>(documentQuery, {
    variables: {
      input: {
        id: id ?? '',
        rulesetId: rulesetId ?? '',
      },
    },
    skip: !id || !rulesetId,
  });

  useError({
    error,
    message: 'Failed to load document',
  });

  return {
    document: data?.document ? (data.document as Document) : null,
    loading,
    error,
  };
};
