import { FrameComponentData, SheetComponent, UpdateSheetComponent } from '@/libs/compass-api';
import { IconButton, Tooltip } from '@/libs/compass-core-ui';
import { Input, Popover, PopoverContent, PopoverTrigger, Stack, Text } from '@chakra-ui/react';
import { Language } from '@mui/icons-material';
import { useEditorStore } from '../../../editor-store';

export const FrameEdit = ({
  component,
  disabled,
}: {
  component: SheetComponent;
  disabled?: boolean;
}) => {
  const { sheetId, updateComponent } = useEditorStore();

  const data = JSON.parse(component.data) as FrameComponentData;

  const handleUpdate = (update: Partial<UpdateSheetComponent>) => {
    updateComponent({
      sheetId,
      update: {
        id: component.id,
        data: JSON.stringify({
          ...data,
          ...JSON.parse(update.data ?? '{}'),
        }),
      },
    });
  };

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Tooltip title={'URL'}>
            <IconButton
              disabled={disabled}
              sx={{ color: !!data.url ? 'secondary.main' : 'inherit' }}>
              <Language />
            </IconButton>
          </Tooltip>
        </PopoverTrigger>
        <PopoverContent>
          <Stack padding={2} spacing={1}>
            <Text>Embed URL</Text>
            <Input
              id='frame-url'
              value={data.url}
              placeholder='URL'
              onChange={(e) => handleUpdate({ data: JSON.stringify({ url: e.target.value }) })}
            />
          </Stack>
        </PopoverContent>
      </Popover>
    </>
  );
};
