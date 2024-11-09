import { Image, Sheet, SheetDetails, useUpdateSheet } from '@/libs/compass-api';
import { ImageWithUpload } from '@/libs/compass-core-composites';
import { ToggleButton, ToggleButtonGroup } from '@/libs/compass-core-ui';
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Crop, CropFree } from '@mui/icons-material';
import debounce from 'lodash.debounce';
import { useMemo } from 'react';

interface Props {
  sheet?: Sheet | null;
}

export const SheetBackgroundImage = ({ sheet }: Props) => {
  const details = JSON.parse(sheet?.details ?? '{}') as SheetDetails;
  const { updateSheet, loading } = useUpdateSheet();

  const setDetails = (updates: SheetDetails, cacheOnly?: boolean) => {
    if (!sheet) return;
    updateSheet(
      {
        input: {
          id: sheet.id,
          details: JSON.stringify({
            ...updates,
          }),
        },
      },
      {
        cacheOnly,
      },
    );
  };

  const handleSaveImage = async (image: Image | null) => {
    if (!sheet) return;
    updateSheet({
      input: {
        id: sheet.id,
        backgroundImageId: image?.id ?? null,
      },
    });
  };

  const debouncedUpdate = useMemo(
    () =>
      debounce(setDetails, 500, {
        trailing: true,
      }),
    [],
  );

  const updateBackgroundOpacity = (backgroundImgOpacity: number) => {
    setDetails({ backgroundImgOpacity }, true);

    debouncedUpdate({
      backgroundImgOpacity,
    });
  };

  return (
    <Stack direction='row' alignItems='center' spacing={4}>
      <Stack spacing={1}>
        <Text>Background Image</Text>
        <ImageWithUpload
          loading={loading}
          src={sheet?.backgroundImage?.src ?? ''}
          onSelect={handleSaveImage}
          onRemove={() => handleSaveImage(null)}
          containerStyle={{ height: 150, width: 150 }}
          imageStyle={{
            width: '150px',
            height: '150px',
          }}
        />
      </Stack>

      <Stack spacing={2}>
        <Stack alignItems='flex-start'>
          <Text fontSize='0.9rem'>Position</Text>
          <ToggleButtonGroup
            exclusive
            value={details.backgroundImgSize}
            onChange={(_, val) => setDetails({ backgroundImgSize: val })}>
            <ToggleButton value='cover' title='Cover' size='small'>
              <CropFree />
            </ToggleButton>
            <ToggleButton value='contain' title='Contain' size='small'>
              <Crop />
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
        <Stack spacing={1}>
          <Text fontSize='0.9rem'>Opacity</Text>
          <NumberInput
            sx={{ width: 100 }}
            value={details.backgroundImgOpacity ?? 1}
            min={0.1}
            max={1}
            step={0.1}
            onChange={(value) => updateBackgroundOpacity(parseFloat(value))}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Stack>
      </Stack>
    </Stack>
  );
};
