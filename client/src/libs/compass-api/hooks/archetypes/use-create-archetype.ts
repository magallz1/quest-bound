import { useParams } from 'react-router-dom';
import {
  Archetype,
  archetypes,
  CreateArchetype,
  createArchetype as createArchetypeMutation,
  CreateArchetypeMutation,
  CreateArchetypeMutationVariables,
} from '../../gql';
import { useMutation } from '../../utils';
import { useError } from '../metrics';
import { useCreatePage } from '../pages';
import { useRuleset } from '../rulesets';

export const useCreateArchetype = () => {
  const { rulesetId } = useParams();
  const { ruleset } = useRuleset(rulesetId);
  const details = JSON.parse(ruleset?.details ?? '{}');
  const { archetypeTemplateId } = details;

  const { createPage } = useCreatePage();

  const [mutation, { loading, error }] = useMutation<
    CreateArchetypeMutation,
    CreateArchetypeMutationVariables
  >(createArchetypeMutation, {
    refetchQueries: [{ query: archetypes, variables: { rulesetId } }],
  });

  useError({
    error,
    message: 'Failed to create archetype',
    location: 'useCreateArchetype',
  });

  const createArchetype = async (input: Omit<CreateArchetype, 'rulesetId'>) => {
    if (!rulesetId) return;
    const res = await mutation({
      variables: {
        input: {
          ...input,
          rulesetId,
        },
      },
    });

    if (!res.data) {
      throw new Error('Failed to create archetype');
    }

    if (archetypeTemplateId) {
      await createPage({
        title: input.title,
        templateId: archetypeTemplateId,
        archetypeId: res.data.createArchetype.id,
      });
    }

    return res.data.createArchetype as Archetype;
  };

  return {
    createArchetype,
    loading,
    error,
  };
};
