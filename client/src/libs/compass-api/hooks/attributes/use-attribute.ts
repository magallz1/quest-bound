import { useParams } from 'react-router-dom';
import { Attribute, attribute, AttributeQuery, AttributeQueryVariables } from '../../gql';
import { useLazyQuery, useQuery } from '../../utils';
import { useError } from '../metrics';

export const useAttribute = (id?: string) => {
  const { rulesetId } = useParams();
  const {
    data,
    error: queryError,
    loading: queryLoading,
  } = useQuery<AttributeQuery, AttributeQueryVariables>(attribute, {
    variables: {
      input: {
        id: id ?? '',
        rulesetId: rulesetId ?? '',
      },
    },
    skip: !id || !rulesetId,
  });

  useError({
    error: queryError,
    message: 'Failed to load attribute',
  });

  const [query, { loading, error }] = useLazyQuery<AttributeQuery, AttributeQueryVariables>(
    attribute,
  );

  useError({
    error,
    message: 'Failed to load attribute',
  });

  const getAttribute = async (id: string) => {
    if (!rulesetId) return;
    const res = await query({
      variables: {
        input: {
          id,
          rulesetId,
        },
      },
    });

    return res.data?.attribute as Attribute;
  };

  return {
    attribute: data?.attribute ? (data?.attribute as Attribute) : null,
    getAttribute,
    loading: queryLoading || loading,
    error,
  };
};
