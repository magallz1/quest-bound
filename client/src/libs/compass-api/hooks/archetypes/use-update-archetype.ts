import { useParams } from 'react-router-dom';
import {
  Archetype,
  archetype,
  UpdateArchetype,
  updateArchetype as updateArchetypeMutation,
  UpdateArchetypeMutation,
  UpdateArchetypeMutationVariables,
} from '../../gql';
import { useMutation } from '../../utils';
import { useError } from '../metrics';
import { useArchetypes } from './use-archetypes';

export const useUpdateArchetype = () => {
  const { rulesetId } = useParams();
  const [mutation, { error, loading }] = useMutation<
    UpdateArchetypeMutation,
    UpdateArchetypeMutationVariables
  >(updateArchetypeMutation);

  const { archetypes } = useArchetypes();

  useError({
    error,
    message: 'Failed to update archetype',
    location: 'useUpdateArchetype',
  });

  const updateArchetype = async (input: Omit<UpdateArchetype, 'rulesetId'>) => {
    const thisArchetype = archetypes.find((arch) => arch.id === input.id);
    if (!thisArchetype || !rulesetId) return;

    const res = await mutation({
      variables: {
        input: {
          rulesetId,
          ...input,
        },
      },
      refetchQueries: [{ query: archetype, variables: { input: { rulesetId, id: input.id } } }],
      awaitRefetchQueries: true,
      optimisticResponse: {
        updateArchetype: {
          ...thisArchetype,
          ...input,
          title: input.title ?? thisArchetype.title ?? undefined,
          rulesetId,
          __typename: 'Archetype',
        },
      },
    });

    if (!res.data) {
      throw new Error('Failed to update archetype');
    }

    return res.data.updateArchetype as Archetype;
  };

  return {
    updateArchetype,
    loading,
    error,
  };
};
