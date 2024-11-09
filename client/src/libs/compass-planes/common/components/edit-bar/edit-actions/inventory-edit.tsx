import {
  Image,
  InventoryComponentData,
  SheetComponent,
  UpdateSheetComponent,
  useImages,
} from '@/libs/compass-api';
import { SelectImageModal } from '@/libs/compass-core-composites';
import { Button, FontSelect, IconButton, Tooltip as CoreTooltip } from '@/libs/compass-core-ui';
import { Input, Popover, PopoverContent, PopoverTrigger, Stack, Tooltip } from '@chakra-ui/react';
import { Add, AddPhotoAlternate, BurstMode, Delete, Key, Rtt } from '@mui/icons-material';
import { useState } from 'react';
import { useEditorStore } from '../../../editor-store';
import { getInitialValues } from '../../../utils';
import { FontSize, TextAlign } from './common-actions';

export const InventoryEdit = ({
  components,
  disabled,
}: {
  components: SheetComponent[];
  disabled?: boolean;
}) => {
  const { sheetId, updateComponents } = useEditorStore();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [newSlotKey, setNewSlotKey] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const { createImage } = useImages();

  const initialValues = getInitialValues(components);

  const data = JSON.parse(initialValues.data) as InventoryComponentData;
  const css = JSON.parse(initialValues.style);
  const isTextBased = data.isText;

  const slotKeys = data.slotKeys
    .split(',')
    .filter(Boolean)
    .map((key) => key.trim());

  const handleUpdateData = (update: Partial<InventoryComponentData>) => {
    updateComponents({
      sheetId,
      updates: components.map((comp) => {
        return {
          id: comp.id,
          data: JSON.stringify({
            ...data,
            ...update,
          }),
        };
      }),
    });
  };

  const addSlotKey = () => {
    if (slotKeys.includes(newSlotKey)) return;
    const updatedSlotKeys = [...slotKeys, newSlotKey].join(',');
    handleUpdateData({ slotKeys: updatedSlotKeys });
    setNewSlotKey('');
  };

  const removeSlotKey = (key: string) => {
    const updatedSlotKeys = slotKeys.filter((slotKey) => slotKey !== key).join(',');
    handleUpdateData({ slotKeys: updatedSlotKeys });
  };

  const handleImageUpdate = (image: Image | null) => {
    updateComponents({
      sheetId,
      updates: components.map((comp) => {
        return {
          id: comp.id,
          imageIds: image ? [image.id] : [],
          removeImageIds: comp.images?.map((image) => image.id) || [],
        };
      }),
    });
  };

  const handleUpdate = (update: Partial<UpdateSheetComponent>) => {
    updateComponents({
      sheetId,
      updates: components.map((comp) => {
        return {
          id: comp.id,
          ...update,
          style: JSON.stringify({
            ...css,
            ...JSON.parse(update.style ?? '{}'),
          }),
        };
      }),
    });
  };

  const handleCreateImageFromUrl = async (url: string) => {
    setLoading(true);

    const name = url.split('/').pop()?.split('#')[0].split('?')[0] ?? 'Image from URL';

    const res = await createImage({
      src: url,
      name,
    });

    handleImageUpdate(res);
    setLoading(false);
    setModalOpen(false);
  };

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <CoreTooltip title={disabled ? '' : 'Set Image'}>
            <IconButton aria-label='Set image' disabled={disabled}>
              <AddPhotoAlternate />
            </IconButton>
          </CoreTooltip>
        </PopoverTrigger>
        <PopoverContent>
          <Stack padding={2} spacing={2}>
            <Button onClick={() => setModalOpen(true)} color='info'>
              Set Image
            </Button>
            <Input
              id='image-alt'
              placeholder='Image Alt'
              value={data.alt}
              onChange={(e) => handleUpdateData({ alt: e.target.value })}
            />
          </Stack>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger>
          <CoreTooltip title={disabled ? '' : 'Slot Keys'}>
            <IconButton disabled={disabled} aria-label='Slot keys'>
              <Key />
            </IconButton>
          </CoreTooltip>
        </PopoverTrigger>
        <PopoverContent>
          <Stack padding={2} spacing={2}>
            <Stack direction='row'>
              <Input
                placeholder='Slot Key'
                value={newSlotKey}
                onChange={(e) => setNewSlotKey(e.target.value)}
              />
              <IconButton
                aria-label='Add slot key'
                onClick={addSlotKey}
                disabled={slotKeys.includes(newSlotKey) || !newSlotKey}>
                <Tooltip
                  label='Restrict items placed within this component to those with this key'
                  placement='right'>
                  <Add />
                </Tooltip>
              </IconButton>
            </Stack>
            {slotKeys.map((key) => (
              <Stack key={key} direction='row' justifyContent='space-between' padding={1}>
                <span>{key}</span>
                <IconButton onClick={() => removeSlotKey(key)} aria-label='delete'>
                  <Delete />
                </IconButton>
              </Stack>
            ))}
          </Stack>
        </PopoverContent>
      </Popover>

      <CoreTooltip
        title={isTextBased ? 'Toggle image based inventory' : 'Toggle text based inventory'}>
        <IconButton onClick={() => handleUpdateData({ isText: !isTextBased })}>
          {isTextBased ? <BurstMode /> : <Rtt />}
        </IconButton>
      </CoreTooltip>

      {isTextBased && (
        <>
          <FontSelect
            disabled={disabled}
            selected={css.fontFamily}
            onChange={(fontFamily) => handleUpdate({ style: JSON.stringify({ fontFamily }) })}
            style={{ minWidth: 165 }}
          />

          <FontSize value={css.fontSize} disabled={disabled} onChange={handleUpdate} />

          <TextAlign
            disabled={disabled}
            alignment={css.textAlign}
            centerAlignment={css.centerAlign}
            onChange={handleUpdate}
            hideAlignTool
          />
        </>
      )}

      <SelectImageModal
        loading={loading}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        onSelect={handleImageUpdate}
        onSaveUrl={handleCreateImageFromUrl}
        onRemoveUrl={() => handleImageUpdate(null)}
      />
    </>
  );
};
