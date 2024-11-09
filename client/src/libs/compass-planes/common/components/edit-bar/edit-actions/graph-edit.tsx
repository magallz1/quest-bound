import {
  Attribute,
  AttributeType,
  GraphComponentData,
  SheetComponent,
  UpdateSheetComponent,
} from '@/libs/compass-api';
import { AttributeLookup } from '@/libs/compass-core-composites';
import { IconButton, ToggleButton, ToggleButtonGroup, Tooltip } from '@/libs/compass-core-ui';
import {
  FormControl,
  FormLabel,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Switch,
  Text,
} from '@chakra-ui/react';
import {
  AlignHorizontalLeft,
  AlignVerticalBottom,
  BarChart,
  TrackChanges,
} from '@mui/icons-material';
import { useEditorStore } from '../../../editor-store';
import { AssignAttribute } from './assign-attribute';

export const GraphEdit = ({
  component,
  disabled,
}: {
  component: SheetComponent;
  disabled?: boolean;
}) => {
  const { sheetId, updateComponent } = useEditorStore();

  const data = JSON.parse(component.data) as GraphComponentData;

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
      <AssignAttribute data={data} onChange={handleUpdate} filterByType={AttributeType.NUMBER} />

      <Popover>
        <PopoverTrigger>
          <Tooltip title='Graph Settings'>
            <IconButton>
              <BarChart fontSize='small' />
            </IconButton>
          </Tooltip>
        </PopoverTrigger>
        <PopoverContent>
          <Stack padding={2} spacing={2}>
            <Stack spacing={1}>
              <Text sx={{ fontSize: '0.9rem' }}>Max Value</Text>

              <AttributeLookup
                onSelect={(attribute: Attribute | null) =>
                  handleUpdate({
                    data: JSON.stringify({
                      maxValueAttributeId: attribute?.id ?? null,
                    }),
                  })
                }
                attributeId={data.maxValueAttributeId ?? undefined}
                filterByType={AttributeType.NUMBER}
              />
            </Stack>

            <ToggleButtonGroup
              exclusive
              value={[data.type ?? 'horizontal']}
              onChange={(_, type) => handleUpdate({ data: JSON.stringify({ type }) })}>
              <ToggleButton value='horizontal' title='Horizontal'>
                <AlignHorizontalLeft fontSize='small' />
              </ToggleButton>
              <ToggleButton value='vertical' title='Vertical'>
                <AlignVerticalBottom fontSize='small' />
              </ToggleButton>
              <ToggleButton value='radial' title='Radial'>
                <TrackChanges fontSize='small' />
              </ToggleButton>
            </ToggleButtonGroup>

            <FormControl display='flex'>
              <FormLabel htmlFor='inverse' mb='0'>
                <Text>Inverse Fill</Text>
              </FormLabel>

              <Switch
                id='inverse'
                isChecked={data.inverse ?? false}
                onChange={(e) =>
                  handleUpdate({ data: JSON.stringify({ inverse: e.target.checked }) })
                }
              />
            </FormControl>

            <Input
              placeholder='Seconds'
              value={data.animationDelay ?? 0.5}
              type='number'
              onChange={(e) =>
                handleUpdate({
                  data: JSON.stringify({
                    animationDelay: parseFloat(e.target.value),
                  }),
                })
              }
            />
          </Stack>
        </PopoverContent>
      </Popover>
    </>
  );
};
