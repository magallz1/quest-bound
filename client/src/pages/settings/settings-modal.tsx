import { useCharacter, useGetSheet, usePage, useRuleset } from '@/libs/compass-api';
import { Divider, Drawer, IconButton, useDeviceSize } from '@/libs/compass-core-ui';
import { SettingsContext } from '@/libs/compass-web-utils';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
} from '@chakra-ui/react';
import { DoubleArrow } from '@mui/icons-material';
import { useContext, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { CharacterSettingsNav } from './character-settings';
import { RenderSettingsContent } from './render-settings-content';
import { RulesetSettingsNav } from './ruleset-settings';
import { SettingsNav } from './settings-nav';
import { SheetSettingsNav } from './sheet-settings/sheet-settings-nav';

export const SettingsModal = () => {
  const { rulesetId, characterId, sheetId } = useParams();

  const [searchParams] = useSearchParams();
  const pageId = searchParams.get('page') ?? '';

  const { ruleset, canEdit } = useRuleset(rulesetId);
  const { character } = useCharacter(characterId);
  const { sheet } = useGetSheet(sheetId);
  const { page } = usePage(pageId);

  const pageSheet = page?.sheet;
  const settingsSheet = character?.sheet ?? sheet ?? pageSheet;
  const title = page?.title ?? settingsSheet?.title;

  const { settingsModalOpen, openSettingsModal, settingsPage, setSettingsPage } =
    useContext(SettingsContext);

  const { desktop } = useDeviceSize();

  const [expanded, setExpanded] = useState<boolean>(false);

  const handlePageChange = (page: string) => {
    setSettingsPage(page);
    setExpanded(false);
  };

  const NavOptions = () => (
    <>
      <Text fontSize='0.9rem'>Profile</Text>
      <Divider />
      <SettingsNav page={settingsPage} setPage={handlePageChange} />

      {!character && ruleset && canEdit && (
        <>
          <Text fontSize='0.9rem'>{ruleset.title}</Text>
          <Divider />
          <RulesetSettingsNav page={settingsPage} setPage={handlePageChange} />
        </>
      )}

      {character && (
        <>
          <Text fontSize='0.9rem'>{character.name}</Text>
          <Divider />
          <CharacterSettingsNav page={settingsPage} setPage={handlePageChange} />
        </>
      )}

      {settingsSheet && (
        <>
          <Text fontSize='0.9rem'>{title}</Text>
          <Divider />
          <SheetSettingsNav isPageSheet={!sheet} page={settingsPage} setPage={handlePageChange} />
        </>
      )}
    </>
  );

  return (
    <Modal
      isCentered
      size='xl'
      isOpen={settingsModalOpen}
      onClose={() => {
        openSettingsModal(false);
        setSettingsPage('profile');
      }}>
      <ModalOverlay />
      <ModalContent
        height={desktop ? '60dvh' : '80dvh'}
        maxW={desktop ? '60dvw' : '80dvw'}
        minWidth='350px'
        minHeight='600px'>
        <ModalCloseButton />
        <ModalBody>
          <Stack
            direction={!desktop ? 'column' : 'row'}
            justifyContent='flex-start'
            spacing={2}
            width='100%'
            height='100%'>
            {!desktop ? (
              <>
                <Stack width='100%' alignItems='flex-start'>
                  <IconButton size='small' onClick={() => setExpanded(true)}>
                    <DoubleArrow fontSize='small' />
                  </IconButton>
                </Stack>
                <Drawer variant='persistent' open={expanded} onClose={() => setExpanded(false)}>
                  <Stack width='90vw' gap={1} padding={2}>
                    <NavOptions />
                  </Stack>
                </Drawer>
              </>
            ) : (
              <Stack width={240} spacing={1} padding={2} sx={{ overflowY: 'auto' }}>
                <NavOptions />
              </Stack>
            )}

            <Stack
              sx={{ overflow: 'auto', height: '60dvh', minHeight: '550px', width: '100%' }}
              padding={2}
              spacing={4}
              justifyContent='flex-start'>
              <RenderSettingsContent settingsPage={settingsPage} />
            </Stack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
