import debounce from 'lodash.debounce';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  UpdateAttribute,
  updateAttribute as updateAttributeMutation,
  UpdateAttributeMutation,
  UpdateAttributeMutationVariables,
  updateAttributeOrder,
  UpdateAttributeOrderMutation,
  UpdateAttributeOrderMutationVariables,
} from '../../gql';
import { useMutation } from '../../utils/wrapped-apollo-hooks';
import { useError } from '../metrics';
import { useCacheHelpers } from './cache-helpers';

export const useUpdateAttribute = (debounceTime = 0) => {
  const { rulesetId } = useParams();

  const [mutation, { loading, error }] = useMutation<
    UpdateAttributeMutation,
    UpdateAttributeMutationVariables
  >(updateAttributeMutation);

  const [sortMutation] = useMutation<
    UpdateAttributeOrderMutation,
    UpdateAttributeOrderMutationVariables
  >(updateAttributeOrder, {
    fetchPolicy: 'no-cache',
  });

  const { updateAttributeCacheOnly, getAttributeFromCache } = useCacheHelpers();

  const debouncedMutation = useMemo(() => debounce(mutation, debounceTime), []);
  const debounceSortMutation = useMemo(() => debounce(sortMutation, debounceTime), []);

  useError({
    error,
    message: 'Failed to update attribute',
  });

  function applyUpdateToLogic(update: Omit<UpdateAttribute, 'rulesetId'>) {
    if (update.defaultValue === undefined) return update;
    // If attribute default, min or max are changed, update the corresponding logic operations
    const cachedAttribute = getAttributeFromCache(update.id);
    if (!cachedAttribute || !cachedAttribute.logic) return update;

    const logicUpdate = update.logic ?? cachedAttribute.logic ?? '[]';

    return {
      ...update,
      logic: JSON.stringify(
        JSON.parse(logicUpdate).map((op: any) => {
          if (op.type !== 'default-value') return op;
          return {
            ...op,
            value: update.defaultValue ?? cachedAttribute.defaultValue,
          };
        }),
      ),
    };
  }

  const updateAttribute = async (input: Omit<UpdateAttribute, 'rulesetId'>) => {
    if (!rulesetId) return;
    const update = applyUpdateToLogic(input);
    updateAttributeCacheOnly({ ...update, rulesetId });

    debouncedMutation({
      variables: {
        input: {
          ...update,
          rulesetId,
        },
      },
      // Cache is updated directly above. Avoid unnecessary cache write, which
      // could cause UI flicker
      fetchPolicy: 'no-cache',
    });
  };

  const updateAttributes = async (input: Array<Omit<UpdateAttribute, 'rulesetId'>>) => {
    if (!rulesetId) return;
    for (const update of input) {
      updateAttributeCacheOnly({
        ...applyUpdateToLogic(update),
        rulesetId,
      });
    }

    debounceSortMutation({
      variables: {
        input: {
          rulesetId,
          attributes: input.map((a) => ({
            ...applyUpdateToLogic(a),
            rulesetId,
          })),
        },
      },
    });

    return 'success';
  };

  return {
    updateAttribute,
    updateAttributes,
    loading,
    error,
  };
};
