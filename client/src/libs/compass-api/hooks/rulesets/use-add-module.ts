import { useNotifications } from '@/stores';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  AddModule,
  addModule as addModuleMutation,
  AddModuleMutation,
  AddModuleMutationVariables,
  archetypes,
  attributes,
  charts,
  documents,
  pages,
  pageTemplates,
  ruleset,
  sheetComponents,
  sheetTemplates,
} from '../../gql';
import { useMutation } from '../../utils';
import { useError } from '../metrics';
import { getModuleWithDependencies } from './helpers';
import { useRulesets } from './use-rulesets';

export const useAddModule = () => {
  const { rulesetId } = useParams();
  const { addNotification } = useNotifications();

  const { modules } = useRulesets();

  const [addingMessage, setAddingMessage] = useState<string>();

  const [mutation, { loading, error }] = useMutation<AddModuleMutation, AddModuleMutationVariables>(
    addModuleMutation,
    {
      awaitRefetchQueries: true,
    },
  );

  useError({
    error,
    message: 'Failed to add module',
  });

  const addModule = async (input: AddModule) => {
    if (!rulesetId) return;
    const targetModuleId = input.moduleId;
    const moduleWithDependencies = getModuleWithDependencies(targetModuleId, modules);

    for (let i = 0; i < moduleWithDependencies.length; i++) {
      const moduleToAdd = moduleWithDependencies[i];
      setAddingMessage(`Adding ${moduleToAdd.title}`);

      const refetchQueries =
        i === moduleWithDependencies.length - 1
          ? [
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
            ]
          : [];

      await mutation({
        variables: { input: { rulesetId, moduleId: moduleToAdd.id } },
        refetchQueries,
      });
    }

    addNotification({
      message: `Module added`,
      status: 'success',
    });

    setAddingMessage(undefined);

    return 'success';
  };

  return {
    addModule,
    addingMessage,
    loading,
    error,
  };
};
