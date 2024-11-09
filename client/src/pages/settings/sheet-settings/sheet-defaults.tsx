import { SheetDetails, useGetSheet, useUpdateSheet } from '@/libs/compass-api';
import { ColorPickerPopper, FontSelect } from '@/libs/compass-core-ui';
import {
  Box,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSheetColors } from '../hooks/use-sheet-colors';
import { SheetBackgroundImage } from './sheet-background-image';

export const SheetDefaults = () => {
  const { sheetId } = useParams();
  const { sheet } = useGetSheet(sheetId);

  const { colors, addColor, removeColor } = useSheetColors(sheet?.id);

  const { updateSheet, loading: saveLoading } = useUpdateSheet();
  const [color, setColor] = useState<string>('#FFFFFF');
  const details = JSON.parse(sheet?.details ?? '{}') as SheetDetails;

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

  const handleAddColor = async () => {
    addColor(color);
  };

  return (
    <>
      <Text>Default Font</Text>
      <FontSelect
        style={{ width: 250 }}
        id='defaultFont'
        onChange={(value) => setDetails({ defaultFont: value })}
        selected={details.defaultFont ?? 'Roboto Condensed'}
      />
      <Stack spacing={2} width='100%' justifyContent='flex-start'>
        <Text>Color Palette</Text>

        <ColorPickerPopper
          color={color}
          onChange={setColor}
          component={<Button sx={{ width: 200 }}>Add Color</Button>}
          swatches={[...colors, color]}
          onSave={handleAddColor}
          saveDisabled={colors.length >= 12}
          saveLoading={saveLoading}
        />
        <Stack
          direction='row'
          sx={{
            flexWrap: 'wrap',
            gap: '8px',
          }}>
          {colors.map((c, i) => (
            <Popover key={i}>
              <PopoverTrigger>
                <Box
                  role='button'
                  sx={{
                    borderRadius: '4px',
                  }}
                  style={{ height: '25px', width: '25px', backgroundColor: c }}
                />
              </PopoverTrigger>
              <PopoverContent sx={{ width: '100px' }}>
                <Button onClick={() => removeColor(c)}>Remove</Button>
              </PopoverContent>
            </Popover>
          ))}
        </Stack>
      </Stack>

      <SheetBackgroundImage sheet={sheet} />
    </>
  );
};
