import { Attribute, AttributeContext, AttributeType } from '@/libs/compass-api';
import { AttributeLookup } from '@/libs/compass-core-composites';
import { IconButton, Tooltip } from '@/libs/compass-core-ui';
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { Backpack } from '@mui/icons-material';
import { useContext, useState } from 'react';
import { SimpleInventory } from './simple-inventory';

export const InventoryPanel = () => {
  const { addItem } = useContext(AttributeContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filter, setFilter] = useState('');

  const onSelect = (attribute: Attribute | null) => {
    if (!attribute) return;
    addItem(attribute);
  };

  return (
    <>
      <Tooltip title='Inventory'>
        <IconButton onClick={onOpen}>
          <Backpack />
        </IconButton>
      </Tooltip>
      <Drawer onClose={onClose} isOpen={isOpen} size='lg'>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Inventory</DrawerHeader>
          <DrawerBody>
            <Stack spacing={4}>
              <Stack direction='row'>
                <AttributeLookup
                  filterByType={AttributeType.ITEM}
                  placeholder='Add Item'
                  onSelect={onSelect}
                  disablePortal
                />

                <Input
                  placeholder='Filter by name'
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </Stack>
              <SimpleInventory filter={filter} />
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
