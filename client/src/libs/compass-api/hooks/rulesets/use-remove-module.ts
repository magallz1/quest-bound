import { useNotifications } from '@/stores';
import { useParams } from 'react-router-dom';
import {
  archetypes,
  attributes,
  charts,
  documents,
  pages,
  pageTemplates,
  RemoveModule,
  removeModule as removeModuleMutation,
  RemoveModuleMutation,
  RemoveModuleMutationVariables,
  ruleset,
  sheetComponents,
  sheetTemplates,
} from '../../gql';
import { useMutation } from '../../utils';
import { useError } from '../metrics';
import { getModuleWithDependencies } from './helpers';
import { useRulesets } from './use-rulesets';

export const useRemoveModule = () => {
  const { rulesetId } = useParams();
  const { addNotification } = useNotifications();

  const { modules } = useRulesets();

  const [mutation, { loading, error }] = useMutation<
    RemoveModuleMutation,
    RemoveModuleMutationVariables
  >(removeModuleMutation);

  useError({
    error,
    message: 'Failed to remove module',
  });

  const removeModule = async (input: RemoveModule, refetch = true) => {
    if (!rulesetId) return;
    const targetModuleId = input.moduleId;
    const moduleWithDependencies = getModuleWithDependencies(targetModuleId, modules);

    for (let i = moduleWithDependencies.length - 1; i >= 0; i--) {
      const refetchQueries =
        i !== 0 || !refetch
          ? []
          : [
              { query: ruleset, variables: { id: rulesetId } },
              { query: attributes, variables: { rulesetId } },
              { query: archetypes, variables: { rulesetId } },
              { query: charts, variables: { rulesetId } },
              { query: pages, variables: { rulesetId } },
              { query: documents, variables: { rulesetId } },
              { query: sheetTemplates, variables: { rulesetId } },
              { query: pageTemplates, variables: { rulesetId } },
              {
                query: sheetComponents,
                variables: { input: { sheetId: 'archetype', rulesetId } },
              },
              {
                query: sheetComponents,
                variables: { input: { sheetId: 'creature', rulesetId } },
              },
            ];

      const moduleToRemove = moduleWithDependencies[i];
      await mutation({
        variables: {
          input: {
            rulesetId,
            moduleId: moduleToRemove.id,
          },
        },
        refetchQueries,
        awaitRefetchQueries: true,
      });
    }
    addNotification({
      message: `Module removed`,
      status: 'success',
    });

    return 'success';
  };

  return {
    removeModule,
    loading,
    error,
  };
};
