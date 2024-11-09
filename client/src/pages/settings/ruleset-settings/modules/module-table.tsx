import { DescriptionModal } from '@/components/description-modal';
import {
  Ruleset,
  useAddModule,
  useRemoveModule,
  useRuleset,
  useRulesets,
} from '@/libs/compass-api';
import { Img } from '@/libs/compass-core-composites';
import {
  Button,
  Confirm,
  IconButton,
  Loader,
  Progress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@/libs/compass-core-ui';
import { FormControl, FormLabel, Stack, Switch, Text } from '@chakra-ui/react';
import { Delete, Refresh } from '@mui/icons-material';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

interface Props {
  filterValue: string;
}

export const ModuleTable = ({ filterValue }: Props) => {
  const { rulesetId } = useParams();
  const { ruleset } = useRuleset(rulesetId);
  const { modules, loading } = useRulesets();

  const { addModule, loading: addingModule, addingMessage } = useAddModule();
  const { removeModule, loading: removingModule } = useRemoveModule();

  const [syncing, setSyncing] = useState<boolean>(false);
  const [filterSpecific, setFilterSpecific] = useState<boolean>(false);
  const [confirmAddModule, setConfirmAddModule] = useState<Ruleset | null>(null);

  const includedModuleIds = new Set<string>((ruleset?.modules ?? []).map((mod) => mod.id));

  // Generic Modules or those specifically created for this ruleset
  const permittedModules = modules
    .filter(
      (mod) =>
        // RS which was created from the published RS to which this module belongs
        mod.rulesetId === ruleset?.publishedRulesetId ||
        // If the current user created the ruleset, they can add module specific to it.
        // That is the original RS, so it won't have a publishedRulesetId
        mod.rulesetId === ruleset?.id ||
        // Generic Module
        !mod.rulesetId,
    )
    .filter((mod) => mod.id !== rulesetId);

  const dependsOnThisModule = (module: Ruleset) =>
    !!module.modules?.find((m) => m.id === rulesetId);

  const filteredByRuleset = filterSpecific
    ? permittedModules.filter((mod) => !!mod.rulesetId)
    : permittedModules;

  const availableModules = filteredByRuleset.filter((module) => {
    return (
      module.title.toLowerCase().includes(filterValue.toLowerCase()) ||
      module.createdBy.toLowerCase().includes(filterValue.toLowerCase())
    );
  });

  const canRemoveModule = (moduleId: string) => {
    for (const module of ruleset?.modules ?? []) {
      const modWithDeps = modules.find((mod) => mod.id === module.id);
      if (modWithDeps?.modules?.find((mod) => mod.id === moduleId)) {
        return false;
      }
    }
    return true;
  };

  const handleAdd = async (moduleId?: string) => {
    if ((!confirmAddModule && !moduleId) || !rulesetId) return;
    await addModule({
      moduleId: confirmAddModule?.id ?? moduleId ?? '',
      rulesetId,
    });
    setConfirmAddModule(null);
    return 'success';
  };

  const handleRemove = async (moduleId: string, refetch = true) => {
    if (!rulesetId) return;
    await removeModule(
      {
        moduleId,
        rulesetId,
      },
      refetch,
    );
    return 'success';
  };

  const handleSync = async (syncModule: Ruleset) => {
    try {
      setSyncing(true);
      // No need to refetch entities on the removal, it's done in the refetchQueries of addModule
      await handleRemove(syncModule.id, false);
      await handleAdd(syncModule.id);
    } catch {
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Stack spacing={4} padding={2} sx={{ flexGrow: 1 }}>
      <FormControl display='flex' alignItems='center'>
        <FormLabel htmlFor='showModules' mb='0'>
          Only show modules specific to this ruleset
        </FormLabel>
        <Switch
          id='showModules'
          isChecked={ruleset?.isModule ?? false}
          onChange={(e) => setFilterSpecific(e.target.checked)}
        />
      </FormControl>

      {addingModule || removingModule || syncing ? <Progress color='info' /> : null}

      <TableContainer sx={{ height: '100%' }}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Module</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Creator</TableCell>
              <TableCell align='right'></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {availableModules.length > 0 ? (
              availableModules.map((module) => (
                <TableRow key={module.id}>
                  <TableCell>
                    <Stack direction='row' spacing={2} alignItems='center'>
                      <Img
                        src={module.image?.src ?? undefined}
                        alt={module.title}
                        style={{ height: 30, width: 30 }}
                      />
                      <Text>{module.title}</Text>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <DescriptionModal title={module.title} value={module.description} />
                  </TableCell>

                  <TableCell>{module.createdBy}</TableCell>

                  <TableCell align='right'>
                    <Stack direction='row' spacing={2} width='100%' justifyContent='flex-end'>
                      <Tooltip
                        title={
                          !canRemoveModule(module.id) ? null : includedModuleIds.has(module.id) ? (
                            <Text>
                              Reset any edits made to this module's content within this ruleset
                            </Text>
                          ) : dependsOnThisModule(module) ? (
                            <Text>{`This module is included in ${module.title}`}</Text>
                          ) : null
                        }>
                        <Button
                          variant='text'
                          disabled={
                            addingModule ||
                            syncing ||
                            dependsOnThisModule(module) ||
                            !canRemoveModule(module.id)
                          }
                          endIcon={!includedModuleIds.has(module.id) ? undefined : <Refresh />}
                          onClick={() => {
                            if (includedModuleIds.has(module.id)) {
                              handleSync(module);
                            } else {
                              setConfirmAddModule(module);
                            }
                          }}>
                          {includedModuleIds.has(module.id) ? 'Reset' : 'Add'}
                        </Button>
                      </Tooltip>
                      {includedModuleIds.has(module.id) && (
                        <Tooltip
                          title={
                            canRemoveModule(module.id) ? null : (
                              <Text>{`Other modules depend on ${module.title}`}</Text>
                            )
                          }>
                          <IconButton
                            onClick={() => handleRemove(module.id)}
                            disabled={removingModule || !canRemoveModule(module.id)}>
                            <Delete fontSize='small' />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell sx={{ borderBottom: 'none' }}>
                  {loading ? (
                    <Loader />
                  ) : (
                    <Text fontStyle='italic'>
                      Add a module to your shelf to add it to this ruleset
                    </Text>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Confirm
        title={`Add ${confirmAddModule?.title}?`}
        open={!!confirmAddModule}
        loading={addingModule}
        onClose={() => setConfirmAddModule(null)}
        onConfirm={handleAdd}>
        <Stack spacing={1}>
          <Text>All entities from this module will be added to this ruleset.</Text>
          {confirmAddModule?.modules?.length && confirmAddModule.modules.length > 0 ? (
            <Stack>
              <Text>The following dependent modules will also be added:</Text>
              <Stack>
                {confirmAddModule?.modules.map((dep) => (
                  <Text sx={{ fontSize: '0.9rem' }} key={dep.id}>
                    {dep.title}
                  </Text>
                ))}
              </Stack>
            </Stack>
          ) : null}

          {addingMessage && <Text>{addingMessage}</Text>}
        </Stack>
      </Confirm>
    </Stack>
  );
};
