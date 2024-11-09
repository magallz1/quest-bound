import {
  AttributeType,
  Image,
  ImageComponentData,
  SheetComponent,
  UpdateSheetComponent,
  useImages,
} from '@/libs/compass-api';
import { SelectImageModal } from '@/libs/compass-core-composites';
import { Button, IconButton, Input, Stack, Switch, Tooltip } from '@/libs/compass-core-ui';
import { Popover, PopoverContent, PopoverTrigger } from '@chakra-ui/react';
import { AddPhotoAlternate } from '@mui/icons-material';
import { useState } from 'react';
import { PlaneEditorType } from '../../../../types';
import { useEditorStore } from '../../../editor-store';
import { getInitialValues } from '../../../utils';
import { AssignAction } from './assign-action';
import { AssignAttribute } from './assign-attribute';
import { AssignLink } from './assign-link';
import { TextAlign } from './common-actions';

export const ImageEdit = ({
  components,
  disabled,
}: {
  components: SheetComponent[];
  disabled?: boolean;
}) => {
  const { sheetId, updateComponents, editorType } = useEditorStore();
  const updateComponentInMap = useEditorStore((state) => state.updateComponentInMap);

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const allowArchetypeAssignment = editorType !== PlaneEditorType.MANAGE;

  const [loading, setLoading] = useState<boolean>(false);
  const { createImage } = useImages();

  const initialValues = getInitialValues(components);

  const data = JSON.parse(initialValues.data) as ImageComponentData;
  const css = JSON.parse(initialValues.style);

  const handleSelectEntityImage = (useEntityImage: boolean) => {
    updateComponents({
      sheetId,
      updates: components
        .filter((c) => !c.locked)
        .map((comp) => {
          return {
            id: comp.id,
            data: JSON.stringify({
              ...data,
              useEntityImage,
            }),
          };
        }),
    });
  };

  const handleUpdateData = (update: Partial<ImageComponentData>) => {
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

  const handleUpdateStyle = (update: any) => {
    updateComponents({
      sheetId,
      updates: components.map((comp) => {
        return {
          id: comp.id,
          style: JSON.stringify({
            ...css,
            ...JSON.parse(update.style ?? '{}'),
          }),
        };
      }),
    });
  };

  const handleUpdateComponentData = (update: Partial<UpdateSheetComponent>) => {
    updateComponents({
      sheetId,
      updates: components.map((comp) => {
        return {
          id: comp.id,
          data: JSON.stringify({
            ...JSON.parse(comp.data),
            pageId: JSON.parse(update.data ?? '{}').pageId,
            attributeId: JSON.parse(update.data ?? '{}').attributeId,
          }),
        };
      }),
    });
  };

  const handleUpdate = (image: Image | null) => {
    updateComponents({
      sheetId,
      updates: components.map((comp) => {
        updateComponentInMap(comp.id, {
          images: [image],
        });

        return {
          id: comp.id,
          imageIds: image ? [image.id] : [],
          removeImageIds: comp.images?.map((image) => image.id) || [],
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

    handleUpdate(res);
    setLoading(false);
    setModalOpen(false);
  };

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Tooltip title={disabled ? '' : 'Set Image'}>
            <IconButton disabled={disabled}>
              <AddPhotoAlternate />
            </IconButton>
          </Tooltip>
        </PopoverTrigger>
        <PopoverContent>
          <Stack padding={2} spacing={2}>
            {allowArchetypeAssignment && (
              <Switch
                label='Use image from character or archetype'
                checked={data.useEntityImage ?? false}
                onChange={(_, checked) => handleSelectEntityImage(checked)}
              />
            )}
            <Button disabled={data.useEntityImage} onClick={() => setModalOpen(true)} color='info'>
              Set Image
            </Button>
            <Input
              id='image-alt'
              helperText='Image Alt'
              value={data.alt}
              onChange={(e) => handleUpdateData({ alt: e.target.value })}
            />
          </Stack>
        </PopoverContent>
      </Popover>

      <AssignAttribute
        data={data}
        onChange={handleUpdateComponentData}
        filterByType={AttributeType.TEXT}
      />

      {editorType === PlaneEditorType.SHEET && (
        <AssignAction
          data={data}
          onChange={(update) => handleUpdateData(JSON.parse(update.data ?? '{}'))}
        />
      )}

      {editorType !== PlaneEditorType.MANAGE && (
        <AssignLink onChange={handleUpdateComponentData} data={data} disabled={disabled} />
      )}

      <TextAlign
        disabled={disabled}
        alignment={css.textAlign}
        centerAlignment={css.centerAlign}
        onChange={handleUpdateStyle}
        hideJustifyTool
      />

      <SelectImageModal
        loading={loading}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        onSelect={handleUpdate}
        onSaveUrl={handleCreateImageFromUrl}
        onRemoveUrl={() => handleUpdate(null)}
      />
    </>
  );
};
