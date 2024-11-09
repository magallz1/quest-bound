import {
  AttributeContext,
  AttributeType,
  ContextualItem,
  InventoryComponentData,
  SheetComponent,
  useAttributes,
} from '@/libs/compass-api';
import { useNotifications } from '@/stores';
import { Button, Center, Image, Input, Stack, Tooltip } from '@chakra-ui/react';
import { Backpack } from '@mui/icons-material';
import { useContext, useState } from 'react';
import { getNewItemCoords } from './utils';

interface Props {
  component: SheetComponent;
}

export const ItemOptionWindow = ({ component }: Props) => {
  const { rulesetItems, addItem, items, updateItemsPositions } = useContext(AttributeContext);
  const existingItems = items.filter((item) => item.data.parentId === component.id);
  const { addNotification } = useNotifications();

  const { attributes } = useAttributes(false, AttributeType.ITEM);

  const data = JSON.parse(component.data) as InventoryComponentData;

  const [filterString, setFilterString] = useState<string>('');

  const inventorySlots =
    data.slotKeys
      ?.split(',')
      .filter(Boolean)
      .map((key) => key.toLowerCase().trim()) ?? [];

  const itemsWithSlotKeys = rulesetItems.filter((item) => {
    if (!inventorySlots.length) return true;
    const itemSlots = item.data.slots.split(',').map((slot) => slot.trim().toLowerCase());
    return inventorySlots.some((slot) => itemSlots.includes(slot));
  });

  const filteredItems = itemsWithSlotKeys.filter((item) =>
    item.name.toLowerCase().includes(filterString.toLowerCase()),
  );

  const onAddItem = (item: ContextualItem) => {
    const coordinates = getNewItemCoords(item, component, existingItems);
    if (!coordinates && !data.isText) {
      addNotification({
        message: 'Item does not fit in inventory',
        status: 'error',
      });
      return;
    }
    const attribute = attributes.find((attribute) => attribute.id === item.id);
    if (!attribute) return;
    addItem(attribute, component.id, coordinates ?? undefined);
  };

  const cleanUpPlacements = () => {
    const updates: ContextualItem[] = [];
    for (const item of existingItems.sort((a, b) => a.id.localeCompare(b.id))) {
      const coordinates = getNewItemCoords(item, component, updates);
      if (!coordinates) continue;
      updates.push({ ...item, data: { ...item.data, x: coordinates.x, y: coordinates.y } });
    }

    updateItemsPositions(
      updates.map((u) => ({ id: u.instanceId, x: u.data.x ?? 0, y: u.data.y ?? 0 })),
    );
  };

  return (
    <Stack style={{ height: 500 }} spacing={3} padding={1}>
      <Input
        placeholder='Filter'
        value={filterString}
        onChange={(e) => setFilterString(e.target.value)}
      />

      <Button onClick={cleanUpPlacements}>Clean Up</Button>

      <Stack sx={{ overflowY: 'auto' }}>
        {filteredItems.map((item) => (
          <Tooltip label={`Add ${item.name}`} placement='right' key={item.id}>
            <Image
              className='clickable'
              onClick={() => onAddItem(item)}
              sx={{ height: `${item.data.height * 20}px`, width: `${item.data.width * 20}px` }}
              draggable={false}
              alt={item.name}
              src={item.data.imageSrc}
              fallback={
                <Tooltip label={`Add ${item.name}`} placement='right'>
                  <Center
                    className='clickable'
                    onClick={() => onAddItem(item)}
                    sx={{
                      backgroundColor: '#42403D',
                      height: `${item.data.height * 20}px`,
                      width: `${item.data.width * 20}px`,
                    }}>
                    <Backpack />
                  </Center>
                </Tooltip>
              }
            />
          </Tooltip>
        ))}
      </Stack>
    </Stack>
  );
};
