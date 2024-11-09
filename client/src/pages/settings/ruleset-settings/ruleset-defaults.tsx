import { SheetDetails, useRuleset, useUpdateRuleset } from '@/libs/compass-api';
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

export const RulesetDefaults = () => {
  const { rulesetId } = useParams();
  const { ruleset } = useRuleset(rulesetId);

  const details = JSON.parse(ruleset?.details ?? '{}') as SheetDetails;
  const colors = (details.colors ?? []) as string[];

  const { updateRuleset, loading: saveLoading } = useUpdateRuleset();

  const [color, setColor] = useState<string>('#FFFFFF');
  const [selectedColor, setSelectedColor] = useState<string>('');

  const setDetails = (updates: SheetDetails) => {
    if (!ruleset) return;
    updateRuleset({
      id: ruleset.id,
      details: JSON.stringify({
        ...details,
        ...updates,
      }),
    });
  };

  const addColor = async (color: string) => {
    if (colors.includes(color)) return;
    setDetails({ colors: [...colors, color] });
  };

  const removeColor = async (color: string) => {
    setDetails({ colors: colors.filter((c) => c !== color) });
  };

  const handleAddColor = async () => {
    addColor(color);
  };

  const handleRemoveColor = async () => {
    removeColor(selectedColor);
    setSelectedColor('');
  };

  return (
    <>
      <Stack>
        <Text>Default Font</Text>
        <FontSelect
          fullWidth
          id='defaultFont'
          label='Default font for text components'
          style={{ width: 250 }}
          onChange={(value) => setDetails({ defaultFont: value })}
          selected={details.defaultFont ?? 'Roboto Condensed'}
        />
      </Stack>
      <Stack spacing={2}>
        <Text>Color Palette</Text>
        {!!selectedColor ? (
          <Button sx={{ width: 200 }} onClick={handleRemoveColor} variant='text'>
            Remove Color
          </Button>
        ) : (
          <ColorPickerPopper
            color={color}
            onChange={setColor}
            component={<Button style={{ width: '200px' }}>Add Color</Button>}
            swatches={[...colors, color]}
            onSave={handleAddColor}
            saveDisabled={colors.length >= 12}
            saveLoading={saveLoading}
          />
        )}
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
    </>
  );
};
