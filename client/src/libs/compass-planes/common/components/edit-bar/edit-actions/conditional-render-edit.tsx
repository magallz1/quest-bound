import { Attribute, AttributeType, ComponentData, SheetComponent } from '@/libs/compass-api';
import { AttributeLookup } from '@/libs/compass-core-composites';
import { IconButton, Tooltip } from '@/libs/compass-core-ui';
import { Checkbox, Popover, PopoverContent, PopoverTrigger, Stack, Text } from '@chakra-ui/react';
import DesktopAccessDisabledIcon from '@mui/icons-material/DesktopAccessDisabled';
import { useEditorStore } from '../../../editor-store';

export const ConditionalRenderEdit = ({
  components,
  disabled,
}: {
  components: SheetComponent[];
  disabled?: boolean;
}) => {
  const { sheetId, updateComponents } = useEditorStore();

  const data = components.length === 1 ? (JSON.parse(components[0].data) as ComponentData) : {};

  const handleAssign = (attribute: Attribute | null) => {
    updateComponents({
      sheetId,
      updates: components.map((component) => ({
        id: component.id,
        data: JSON.stringify({
          ...JSON.parse(component.data),
          conditionalRenderAttributeId: attribute?.id ?? null,
        }),
      })),
    });
  };

  const handleInverse = (conditionalRenderInverse: boolean) => {
    updateComponents({
      sheetId,
      updates: components.map((component) => ({
        id: component.id,
        data: JSON.stringify({
          ...JSON.parse(component.data),
          conditionalRenderInverse,
        }),
      })),
    });
  };

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Tooltip title='Conditional Display'>
            <IconButton
              disabled={disabled}
              sx={{
                color: !!data.conditionalRenderAttributeId ? 'secondary.main' : 'inherit',
              }}>
              <DesktopAccessDisabledIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        </PopoverTrigger>
        <PopoverContent>
          <Stack padding={2} align='center'>
            <Text fontSize='0.9rem'>Conditional Display</Text>
            <AttributeLookup
              onSelect={handleAssign}
              attributeId={data.conditionalRenderAttributeId ?? undefined}
              filterByType={AttributeType.BOOLEAN}
            />

            <Stack spacing={4} direction='row'>
              <Text
                textAlign='center'
                sx={{
                  opacity: data.conditionalRenderAttributeId ? 1 : 0.2,
                }}>{`Display if ${!data.conditionalRenderInverse}`}</Text>
              <Checkbox
                isDisabled={!data.conditionalRenderAttributeId}
                isChecked={!data.conditionalRenderInverse}
                onChange={(e) => handleInverse(!e.target.checked)}
              />
            </Stack>
          </Stack>
        </PopoverContent>
      </Popover>
    </>
  );
};
