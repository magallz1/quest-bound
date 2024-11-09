import { ContentComponentData, SheetComponent } from '@/libs/compass-api';
import { IconButton, Tooltip } from '@/libs/compass-core-ui';
import { Popover, PopoverContent, PopoverTrigger, Stack, Switch, Text } from '@chakra-ui/react';
import { Calculate } from '@mui/icons-material';
import { PlaneEditorType } from '../../../../index';
import { useEditorStore } from '../../../editor-store';

export const ContentEdit = ({
  component,
  disabled,
}: {
  component: SheetComponent;
  disabled?: boolean;
}) => {
  const data = JSON.parse(component.data) as ContentComponentData;
  const { updateComponent, sheetId, editorType } = useEditorStore();

  const handleUseEntityDescription = (useEntityDescription: boolean) => {
    updateComponent({
      sheetId,
      update: {
        id: component.id,
        data: JSON.stringify({
          ...data,
          useEntityDescription,
        }),
      },
    });
  };

  // Content edit actions come from the Content node within a Node Toolbar
  return (
    <Stack direction='row' spacing={1} alignItems='center'>
      {editorType === PlaneEditorType.PAGE && (
        <Popover>
          <PopoverTrigger>
            <Tooltip title='Assign Attribute'>
              <IconButton sx={{ color: data.useEntityDescription ? '#E66A3C' : 'inherit' }}>
                <Calculate fontSize='small' />
              </IconButton>
            </Tooltip>
          </PopoverTrigger>
          <PopoverContent>
            <Stack padding={2} direction='row' spacing={1}>
              <Text>Use description from character or archetype</Text>
              <Switch
                isChecked={data.useEntityDescription ?? false}
                onChange={(e) => handleUseEntityDescription(e.target.checked)}
              />
            </Stack>
          </PopoverContent>
        </Popover>
      )}

      {component.locked ? null : (
        <Text fontStyle='italic' fontSize='0.8rem'>
          Lock component to edit content
        </Text>
      )}
    </Stack>
  );
};
