import { ComponentData, SheetComponent } from '@/libs/compass-api';
import { IconButton, Tooltip } from '@/libs/compass-core-ui';
import { Input, Popover, PopoverContent, PopoverTrigger, Stack, Text } from '@chakra-ui/react';
import { Campaign } from '@mui/icons-material';
import { useEditorStore } from '../../../editor-store';

interface AnnoucmentEditProps {
  disabled?: boolean;
  components: SheetComponent[];
}

export const AnnouncementEdit = ({ disabled, components }: AnnoucmentEditProps) => {
  const { sheetId, updateComponents } = useEditorStore();

  const data = JSON.parse(components[0]?.data ?? '{}') as ComponentData;

  const handleChange = (value: string) => {
    updateComponents({
      sheetId,
      updates: components.map((component) => ({
        id: component.id,
        data: JSON.stringify({
          ...JSON.parse(component.data),
          announcementId: value,
        }),
      })),
    });
  };

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Tooltip title={disabled ? '' : 'Announcement ID'}>
            <IconButton
              disabled={disabled}
              sx={{ color: data.announcementId ? 'secondary.main' : 'inherit' }}>
              <Campaign fontSize='small' />
            </IconButton>
          </Tooltip>
        </PopoverTrigger>
        <PopoverContent>
          <Stack padding={2} spacing={1}>
            <Text>Announcement ID</Text>
            <Input
              value={data.announcementId ?? ''}
              onChange={(e) => handleChange(e.target.value)}
            />
          </Stack>
        </PopoverContent>
      </Popover>
    </>
  );
};
