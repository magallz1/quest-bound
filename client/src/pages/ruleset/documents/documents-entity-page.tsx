import { useQuickCreate } from '@/hooks';
import {
  Document,
  useBootstrapRulebook,
  useDeleteDocument,
  useDocument,
  useDocuments,
  useRuleset,
  useUpdateDocument,
  useUpdateRuleset,
} from '@/libs/compass-api';
import { DocumentLookup } from '@/libs/compass-core-composites';
import { Confirm, DeleteButton } from '@/libs/compass-core-ui';
import { useNotifications } from '@/stores';
import {
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { Add } from '@mui/icons-material';
import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { RenderDocument } from './render-document';

export const DocumentsEntityPage = () => {
  const { rulesetId } = useParams();
  const { ruleset, details } = useRuleset(rulesetId);
  const { documentFileId } = details;

  const { setQuickCreatePage } = useQuickCreate();

  const { addNotification } = useNotifications();
  const [searchParams, setSearchParams] = useSearchParams();

  const { documents } = useDocuments();
  const { deleteDocument, loading: deleteLoading } = useDeleteDocument();
  const { updateDocument, loading: updateLoading } = useUpdateDocument();
  const { updateRuleset, loading: updatingRuleset } = useUpdateRuleset();
  const { bootstrapRulebook, loading: bootstrapping } = useBootstrapRulebook();

  const [selectedDocumentId, setSelectedDocumentId] = useState<string>(
    searchParams.get('documentId') ?? '',
  );
  const [confirmAssignment, setConfirmAssignment] = useState(false);
  const [confirmBootstrap, setConfirmBootstrap] = useState(false);

  const selectedDocument = documents.find((document) => document.id === selectedDocumentId);

  const handleSelect = (document: Document | null) => {
    if (document) {
      setSelectedDocumentId(document.id);
      setSearchParams({ selected: 'documents', documentId: document.id });
    } else {
      setSelectedDocumentId('');
      setSearchParams({ selected: 'documents' });
    }
  };

  const { document } = useDocument(selectedDocument?.id);

  const documentIsAssignedToRulebook = document?.id === documentFileId;

  const assignToRulebook = async () => {
    if (!document || !ruleset) return;
    await updateRuleset({
      id: ruleset.id,
      details: JSON.stringify({
        ...JSON.parse(ruleset.details),
        documentFileSrc: document.fileKey,
        documentFileId: document.id,
      }),
    });
    setConfirmAssignment(false);
    addNotification({
      message: `Assigned ${document.title} to rulebook`,
      status: 'success',
    });
  };

  const removeFromRulebook = async () => {
    if (!ruleset) return;
    await updateRuleset({
      id: ruleset.id,
      details: JSON.stringify({
        ...JSON.parse(ruleset.details),
        documentFileSrc: null,
        documentFileId: null,
      }),
    });
    addNotification({
      message: 'Removed document from rulebook',
      status: 'success',
    });
  };

  const updateTitle = async (title: string) => {
    if (!document) return;
    await updateDocument({
      id: document.id,
      title,
    });
  };

  const handleDelete = async () => {
    if (!document) return;
    await deleteDocument(document.id);
    setSelectedDocumentId('');
    setSearchParams({ selected: 'documents' });
  };

  const handleBootstrap = async () => {
    if (!document) return;
    await bootstrapRulebook(document);
    setConfirmBootstrap(false);
    addNotification({
      message: `Created rulebook pages from ${document.title}`,
      status: 'success',
    });
  };

  return (
    <>
      <Stack spacing={4} id='documents-entity-page' sx={{ flexGrow: 1 }}>
        <Stack direction='row' spacing={3} alignItems='center'>
          <Button
            onClick={() => setQuickCreatePage('document')}
            rightIcon={<Add fontSize='small' />}>
            Create Document
          </Button>

          <DocumentLookup onSelect={handleSelect} />
        </Stack>

        <Stack spacing={2} sx={{ flexGrow: 1 }}>
          <Stack
            direction='row'
            width='100%'
            justifyContent='space-between'
            alignItems='center'
            pl={2}
            pr={2}>
            <Stack direction='row' spacing={2} alignItems='center'>
              {document ? (
                <Editable
                  onSubmit={(val) => updateTitle(val)}
                  fontSize='1.5rem'
                  defaultValue={document.title}>
                  <EditablePreview />
                  <EditableInput />
                </Editable>
              ) : (
                <Text
                  variant={document ? 'h5' : 'body1'}
                  fontStyle={document ? 'inherit' : 'italic'}>
                  Select a document from the dropdown
                </Text>
              )}
            </Stack>
            {!!document && (
              <Stack direction='row' spacing={2}>
                {documentIsAssignedToRulebook ? (
                  <Button onClick={removeFromRulebook} isLoading={updatingRuleset}>
                    Remove from Rulebook
                  </Button>
                ) : (
                  <Button onClick={() => setConfirmAssignment(true)} isLoading={updatingRuleset}>
                    Assign to Rulebook
                  </Button>
                )}
                <Tooltip
                  label={documentIsAssignedToRulebook ? null : 'Must be assigned to rulebook'}>
                  <Button
                    onClick={() => setConfirmBootstrap(true)}
                    color='secondary'
                    isLoading={bootstrapping}
                    isDisabled={!documentIsAssignedToRulebook}>
                    Create Rulebook Pages
                  </Button>
                </Tooltip>
                <DeleteButton
                  loading={deleteLoading}
                  title={`Delete ${document.title}`}
                  onDelete={handleDelete}
                />
              </Stack>
            )}
          </Stack>

          <RenderDocument style={{ height: 'calc(100vh - 205px)' }} />
        </Stack>
      </Stack>

      <Confirm
        title={'Assign this document to the rulebook?'}
        open={confirmAssignment}
        loading={updatingRuleset}
        onClose={() => setConfirmAssignment(false)}
        onConfirm={assignToRulebook}>
        <Text>Only one document may be assigned to the rulebook.</Text>
        <Text>Pages from this document may be displayed within rulebook pages.</Text>
      </Confirm>

      <Confirm
        title={'Create rulebook pages from this document?'}
        open={confirmBootstrap}
        loading={bootstrapping}
        onClose={() => setConfirmBootstrap(false)}
        onConfirm={handleBootstrap}>
        <Text>A rulebook page will be created for each page in this document.</Text>
        <Text>
          This document must continue to be assigned to the rulebook to display these pages.
        </Text>
      </Confirm>
    </>
  );
};
