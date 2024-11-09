import {
  AttributeType,
  CheckboxComponentData,
  Image,
  SheetComponent,
  UpdateSheetComponent,
} from '@/libs/compass-api';
import { ImageWithUpload } from '@/libs/compass-core-composites';
import { Avatar, IconButton, Stack, Text, Tooltip } from '@/libs/compass-core-ui';
import { Popover, PopoverContent, PopoverTrigger } from '@chakra-ui/react';
import {
  AddPhotoAlternate,
  CheckBox,
  CheckBoxOutlineBlank,
  RadioButtonChecked,
  RadioButtonUnchecked,
} from '@mui/icons-material';
import React, { useState } from 'react';
import { useEditorStore } from '../../../editor-store';
import { getInitialValues } from '../../../utils';
import { AssignAttribute } from './assign-attribute';

export const CheckboxEdit = ({
  components,
  disabled,
}: {
  components: SheetComponent[];
  disabled?: boolean;
}) => {
  const { sheetId, updateComponents } = useEditorStore();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const initialValues = getInitialValues(components);

  const css = JSON.parse(initialValues.style);
  const data = JSON.parse(initialValues.data) as CheckboxComponentData;

  const handleUpdate = (update: Partial<UpdateSheetComponent>) => {
    const parsedUpdateData = JSON.parse(update.data ?? '{}');
    updateComponents({
      sheetId,
      updates: components.map((comp) => {
        const css = JSON.parse(comp.style);
        const data = JSON.parse(comp.data) as CheckboxComponentData;

        const existingImageIfChecked = comp.images?.find((img) => img.src === data.imageIfChecked);

        const existingImageIfUnchecked = comp.images?.find(
          (img) => img.src === data.imageIfUnchecked,
        );

        const removeImageIds = [];
        if (parsedUpdateData.imageIfChecked && !!existingImageIfChecked)
          removeImageIds.push(existingImageIfChecked.id);

        if (parsedUpdateData.imageIfUnchecked && !!existingImageIfUnchecked)
          removeImageIds.push(existingImageIfUnchecked.id);

        return {
          id: comp.id,
          ...(update.imageIds && {
            imageIds: update.imageIds,
            removeImageIds,
          }),
          style: JSON.stringify({
            ...css,
            ...JSON.parse(update.style ?? '{}'),
          }),
          data: JSON.stringify({
            ...data,
            ...JSON.parse(update.data ?? '{}'),
          }),
        };
      }),
    });
  };

  const setCustomImage = (image: Image | null, checked: boolean) => {
    handleUpdate({
      imageIds: image ? [image.id] : undefined,
      data: JSON.stringify({
        ...(checked && {
          imageIfChecked: image?.src ?? '',
        }),
        ...(!checked && {
          imageIfUnchecked: image?.src ?? '',
        }),
      }),
    });
  };

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Tooltip title={disabled ? '' : 'Checkbox Styles'}>
            <IconButton onClick={handleClick} disabled={disabled}>
              <CheckBox fontSize='small' />
            </IconButton>
          </Tooltip>
        </PopoverTrigger>
        <PopoverContent>
          <Stack padding={2} spacing={2}>
            <Stack direction='row' spacing={3} alignItems='center' justifyContent='space-between'>
              <Text variant='subtitle2' sx={{ width: '50%' }}>
                Image If Checked
              </Text>

              <IconButton
                onClick={() =>
                  handleUpdate({
                    data: JSON.stringify({
                      type: 'checkbox',
                      imageIfChecked: '',
                    }),
                  })
                }>
                <CheckBox
                  fontSize='small'
                  sx={{
                    color: data.type === 'checkbox' && !data.imageIfChecked ? css.color : 'inherit',
                  }}
                />
              </IconButton>

              <IconButton
                onClick={() =>
                  handleUpdate({
                    data: JSON.stringify({ type: 'radio', imageIfChecked: '' }),
                  })
                }>
                <RadioButtonChecked
                  fontSize='small'
                  sx={{
                    color: data.type === 'radio' && !data.imageIfChecked ? css.color : 'inherit',
                  }}
                />
              </IconButton>

              <Tooltip title={'Set Custom'} placement='right'>
                <ImageWithUpload
                  onRemove={() => setCustomImage(null, true)}
                  onSelect={(image) => setCustomImage(image, true)}>
                  <Avatar
                    variant='square'
                    sx={{ height: 30, width: 30 }}
                    className='clickable'
                    src={data.imageIfChecked}>
                    <AddPhotoAlternate />
                  </Avatar>
                </ImageWithUpload>
              </Tooltip>
            </Stack>

            <Stack direction='row' spacing={3} alignItems='center' justifyContent='space-between'>
              <Text variant='subtitle2' sx={{ width: '50%' }}>
                Image If Unchecked
              </Text>

              <IconButton
                onClick={() =>
                  handleUpdate({
                    data: JSON.stringify({
                      type: 'checkbox',
                      imageIfUnchecked: '',
                    }),
                  })
                }>
                <CheckBoxOutlineBlank
                  fontSize='small'
                  sx={{
                    color:
                      data.type === 'checkbox' && !data.imageIfUnchecked ? css.color : 'inherit',
                  }}
                />
              </IconButton>

              <IconButton
                onClick={() =>
                  handleUpdate({
                    data: JSON.stringify({ type: 'radio', imageIfUnchecked: '' }),
                  })
                }>
                <RadioButtonUnchecked
                  fontSize='small'
                  sx={{
                    color: data.type === 'radio' && !data.imageIfUnchecked ? css.color : 'inherit',
                  }}
                />
              </IconButton>

              <Tooltip title={'Set Custom'} placement='right'>
                <ImageWithUpload
                  onRemove={() => setCustomImage(null, false)}
                  onSelect={(image) => setCustomImage(image, false)}>
                  <Avatar
                    variant='square'
                    sx={{ height: 30, width: 30 }}
                    className='clickable'
                    src={data.imageIfUnchecked}>
                    <AddPhotoAlternate />
                  </Avatar>
                </ImageWithUpload>
              </Tooltip>
            </Stack>
          </Stack>
        </PopoverContent>
      </Popover>

      <AssignAttribute data={data} onChange={handleUpdate} filterByType={AttributeType.BOOLEAN} />
    </>
  );
};
