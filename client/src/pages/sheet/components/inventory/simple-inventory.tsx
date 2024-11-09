import { AttributeContext } from '@/libs/compass-api';
import { InventoryItem } from '@/libs/compass-planes';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useContext } from 'react';

export const SimpleInventory = ({ filter }: { filter: string }) => {
  const { items } = useContext(AttributeContext);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(filter.toLowerCase()),
  );

  const sortedItems = filteredItems.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Stack spacing={12} sx={{ overflowY: 'auto', maxHeight: '90dvh' }}>
      <Accordion allowToggle>
        {sortedItems.map((item) => (
          <AccordionItem key={item.instanceId}>
            <AccordionButton>
              <Stack align='start'>
                <Stack direction='row'>
                  <Text>{item.name}</Text>
                  <AccordionIcon />
                </Stack>
                {item.name !== item.typeOf && (
                  <Text fontSize='sm' fontStyle='italic'>
                    {item.typeOf}
                  </Text>
                )}
              </Stack>
            </AccordionButton>
            <AccordionPanel>
              <InventoryItem item={item} />
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Stack>
  );
};
