import { AttributeContext, InventoryComponentData } from '@/libs/compass-api';
import {
  Center,
  Image,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Backpack } from '@mui/icons-material';
import { useContext } from 'react';
import { useNodeId } from 'reactflow';
import ResizableNodeWrapper from '../../components/resizable-node-wrapper';
import { useEditorStore } from '../../editor-store';
import { useNodeSize } from '../../hooks';
import { InventoryItem } from './inventory-item';

export const ItemNode = () => {
  const { viewMode, getComponent } = useEditorStore();
  const { items } = useContext(AttributeContext);

  const { height, width } = useNodeSize(useNodeId() ?? '');

  const correspondingItem = items.find((item) => item.instanceId === useNodeId());

  if (!correspondingItem) return null;

  const inventoryNodeId = correspondingItem.data.parentId;
  const inventoryComponent = getComponent(inventoryNodeId);
  const inventoryData = JSON.parse(inventoryComponent?.data ?? '{}') as InventoryComponentData;

  const imageSrc = correspondingItem.data.imageSrc;
  const quantity =
    correspondingItem.properties.find((property) => property.id === 'quantity')?.value ?? 0;
  const qty = parseInt(quantity.toString());

  const backgroundColor = !!imageSrc ? 'rgba(255,255,255, 0)' : '#42403D';

  const props = {
    height: correspondingItem.data.height,
    width: correspondingItem.data.width,
    locked: true,
  };

  if (!viewMode || inventoryData.isText) return <></>;

  return (
    <ResizableNodeWrapper props={props} disabled>
      <Popover>
        <PopoverTrigger>
          {imageSrc ? (
            <Image
              sx={{ height, width }}
              draggable={false}
              className='clickable'
              src={imageSrc ?? undefined}
            />
          ) : (
            <Center
              sx={{
                backgroundColor,
                height,
                width,
                outline: '1px solid white',
              }}
              className='clickable'>
              <Backpack />
            </Center>
          )}
        </PopoverTrigger>
        {viewMode && (
          <Portal>
            <PopoverContent>
              <Stack padding={2}>
                <InventoryItem item={correspondingItem} />
              </Stack>
            </PopoverContent>
          </Portal>
        )}
      </Popover>
      {qty > 1 && (
        <Text
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            fontSize: '0.9rem',
          }}>
          {qty}
        </Text>
      )}
    </ResizableNodeWrapper>
  );
};
