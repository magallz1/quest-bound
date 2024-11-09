import { useQuickCreate } from '@/hooks';
import {
  AttributeType,
  useAttribute,
  useAttributes,
  useCreateAttribute,
  useDeleteAttribute,
  useUpdateAttribute,
} from '@/libs/compass-api';
import { IconButton, Loader, Stack, Text, Tooltip } from '@/libs/compass-core-ui';
import { useNotifications } from '@/stores';
import {
  AccountTree,
  AdfScanner,
  Check,
  ContentCopy,
  Delete,
  Edit,
  Scanner,
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

interface RowControlsProps {
  attributeId: string;
  copiedLogic?: string | null;
  setCopiedLogic: (logic: string) => void;
  setCopiedAttributeTitle?: (title: string) => void;
  isItem?: boolean;
}

export const RowControls = ({
  attributeId,
  copiedLogic,
  setCopiedLogic,
  setCopiedAttributeTitle,
  isItem,
}: RowControlsProps) => {
  const { setQuickCreatePage } = useQuickCreate();
  const { rulesetId } = useParams();
  const { addNotification } = useNotifications();
  const [searchParams, setSearchParams] = useSearchParams();
  const [confirmPaste, setConfirmPaste] = useState<boolean>(false);
  const [duplicating, setDuplicating] = useState<boolean>(false);

  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { attributes } = useAttributes();
  const { getAttribute } = useAttribute();
  const { attributes: items } = useAttributes(false, AttributeType.ITEM);

  const entities = isItem ? items : attributes;

  const { createAttribute } = useCreateAttribute();
  const { updateAttribute } = useUpdateAttribute();
  const { deleteAttribute, loading: deleting } = useDeleteAttribute();

  const thisAttribute = entities.find((a) => a.id === attributeId);

  const [copyingLogic, setCopyingLogic] = useState(false);

  const handleDelete = async () => {
    await deleteAttribute(attributeId);
    setConfirmDelete(false);
  };

  const handleDuplicate = async () => {
    try {
      setDuplicating(true);
      const toCopy = await getAttribute(attributeId);
      if (!toCopy || !rulesetId) return;
      const newAttribute = await createAttribute({
        rulesetId,
        name: `${toCopy.name} (Copy)`,
        type: toCopy.type,
        defaultValue: toCopy.defaultValue,
        description: toCopy.description,
        category: toCopy.category,
        restraints: toCopy.restraints,
        data: toCopy.data,
      });

      await updateAttribute({ id: newAttribute.id, logic: toCopy.logic });
    } catch (e) {
      addNotification({
        status: 'error',
        message: 'Failed to duplicate attribute',
      });
    } finally {
      setDuplicating(false);
    }
  };

  const handleCopyLogic = async () => {
    setCopyingLogic(true);
    const entity = await getAttribute(attributeId);
    if (!entity) return;
    setCopiedAttributeTitle?.(entity.name);
    setCopiedLogic(entity.logic);
    setCopyingLogic(false);
  };

  const handlePasteLogic = async () => {
    if (!copiedLogic) return;
    setCopyingLogic(true);
    await updateAttribute({ id: attributeId, logic: copiedLogic });
    setCopyingLogic(false);
    addNotification({
      message: 'Applied copied Logic',
    });
  };

  return (
    <Stack direction='row' spacing={1} alignItems='center' height='100%'>
      <IconButton
        id={`open-logic-editor-${thisAttribute?.name ?? 'attribute'}`}
        title='Logic'
        onClick={() => {
          navigate({
            pathname: isItem
              ? `/rulesets/${rulesetId}/items/${attributeId}`
              : `/rulesets/${rulesetId}/attributes/${attributeId}`,
          });
        }}>
        <AccountTree fontSize='small' />
      </IconButton>
      <IconButton title='Copy Logic' onClick={handleCopyLogic}>
        {copyingLogic ? <Loader color='info' /> : <Scanner fontSize='small' />}
      </IconButton>
      {!!copiedLogic && (
        <Tooltip title={confirmPaste ? <Text>Click again to confirm</Text> : ''} placement='top'>
          <IconButton
            title='Paste Logic'
            disabled={!copiedLogic || copyingLogic}
            onClick={() => {
              if (confirmPaste) {
                handlePasteLogic();
                setConfirmPaste(false);
              } else {
                setConfirmPaste(true);
                setTimeout(() => {
                  setConfirmPaste(false);
                }, 2000);
              }
            }}>
            {confirmPaste ? <Check fontSize='small' /> : <AdfScanner fontSize='small' />}
          </IconButton>
        </Tooltip>
      )}

      <IconButton onClick={handleDuplicate} title='Duplicate' disabled={duplicating}>
        {duplicating ? <Loader color='info' /> : <ContentCopy fontSize='small' />}
      </IconButton>

      <IconButton
        onClick={() => {
          setQuickCreatePage(isItem ? 'item' : 'attribute', { attributeId });
        }}
        title='Edit'>
        <Edit fontSize='small' />
      </IconButton>
      {deleting ? (
        <Loader color='error' />
      ) : (
        <Tooltip title={confirmDelete ? <Text>Click again to confirm</Text> : ''} placement='top'>
          <IconButton
            onClick={() => {
              if (confirmDelete) {
                handleDelete();
                setConfirmDelete(false);
              } else {
                setConfirmDelete(true);
                setTimeout(() => {
                  setConfirmDelete(false);
                }, 2000);
              }
            }}
            title='Delete'>
            {confirmDelete ? <Check fontSize='small' /> : <Delete fontSize='small' />}
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
};
