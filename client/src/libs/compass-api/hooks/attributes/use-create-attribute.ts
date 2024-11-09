import { useParams } from 'react-router-dom';
import {
  attributes,
  AttributeType,
  CreateAttribute,
  createAttribute as createAttributeMutation,
  CreateAttributeMutation,
  CreateAttributeMutationVariables,
} from '../../gql';
import { useMutation } from '../../utils';
import { useError } from '../metrics';

export const useCreateAttribute = () => {
  const { rulesetId } = useParams();

  const [mutation, { loading, error }] = useMutation<
    CreateAttributeMutation,
    CreateAttributeMutationVariables
  >(createAttributeMutation);

  useError({
    error,
    message: 'Failed to create attribute',
  });

  const createAttribute = async (input: CreateAttribute) => {
    const res = await mutation({
      variables: {
        input: {
          ...input,
          sortChildId: null,
        },
      },
      refetchQueries: [
        {
          query: attributes,
          variables: {
            rulesetId,
            type: input.type === AttributeType.ITEM ? input.type : undefined,
          },
        },
      ],
      awaitRefetchQueries: true,
    });

    if (!res.data?.createAttribute) {
      throw Error('Failed to create attribute');
    }

    return res.data.createAttribute;
  };

  return {
    createAttribute,
    loading,
    error,
  };
};
