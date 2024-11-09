import { Drawer, useDeviceSize } from '@/libs/compass-core-ui';
import { emitter } from '@/libs/compass-web-utils';
import {
  Divider,
  IconButton,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
} from '@chakra-ui/react';
import { DoubleArrow } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AttributeForm } from '../../attributes/attribute-form';
import { ItemForm } from '../../items';
import { QuickCreateOptions } from './options';
import { ArchetypeForm } from './quick-archetype';
import { QuickChart } from './quick-chart';
import { QuickDocument } from './quick-document';
import { QuickTemplate } from './quick-template';

interface QuickCreateModalProps {
  onClose: () => void;
  quickCreatePage?: string | null;
}

export const QuickCreateModal = ({ onClose, quickCreatePage }: QuickCreateModalProps) => {
  const { desktop } = useDeviceSize();
  const [expanded, setExpanded] = useState<boolean>(false);
  const [page, setPage] = useState<string>(quickCreatePage ?? 'template');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    emitter.emit('disable-key-events', !!quickCreatePage);
  }, [quickCreatePage]);

  useEffect(() => {
    if (quickCreatePage) {
      setPage(quickCreatePage);
    }
  }, [quickCreatePage]);

  const handlePageChange = (page: string) => {
    setPage(page);
    setExpanded(false);
  };

  const handleClose = () => {
    onClose();
  };

  const renderPage = () => {
    switch (page) {
      case 'template':
      case 'page-template':
        return <QuickTemplate creatingPageTemplate={page === 'page-template'} />;
      case 'chart':
        return <QuickChart />;
      case 'attribute':
        return <AttributeForm attributeId={searchParams.get('attributeId') ?? undefined} />;
      case 'archetype':
        return <ArchetypeForm />;
      case 'document':
        return <QuickDocument />;
      case 'item':
        return <ItemForm itemId={searchParams.get('attributeId') ?? undefined} />;
      default:
        return null;
    }
  };

  return (
    <Modal size='xl' isOpen={!!quickCreatePage} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent
        height={desktop ? '60dvh' : '80dvh'}
        maxW={desktop ? '1000px' : '80dvw'}
        minWidth='350px'
        minHeight='600px'>
        <ModalCloseButton />
        <Stack
          direction={!desktop ? 'column' : 'row'}
          width={'100%'}
          justifyContent='flex-start'
          spacing={2}>
          {!desktop ? (
            <>
              <Stack width='100%' alignItems='flex-start'>
                <IconButton aria-label='Open' variant='ghost' onClick={() => setExpanded(true)}>
                  <DoubleArrow fontSize='small' />
                </IconButton>
              </Stack>
              <Drawer variant='persistent' open={expanded} onClose={() => setExpanded(false)}>
                <Stack width='90vw'>
                  <Stack direction='row' width='100%' justifyContent='space-between' pl={1} pr={1}>
                    <Text>Quick Create</Text>
                    <IconButton
                      aria-label='close'
                      variant='ghost'
                      onClick={() => setExpanded(false)}
                      sx={{ transform: 'rotate(180deg)' }}>
                      <DoubleArrow fontSize='small' />
                    </IconButton>
                  </Stack>
                  <Divider />
                  <QuickCreateOptions page={page} setPage={handlePageChange} />
                </Stack>
              </Drawer>
            </>
          ) : (
            <Stack width='25%'>
              <QuickCreateOptions page={page} setPage={setPage} />
            </Stack>
          )}

          <Stack
            padding={4}
            spacing={3}
            justifyContent='flex-start'
            overflowY='auto'
            width='100%'
            maxHeight='60dvh'>
            {renderPage()}
          </Stack>
        </Stack>
      </ModalContent>
    </Modal>
  );
};
