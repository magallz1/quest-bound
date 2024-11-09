import { useRuleset } from '@/libs/compass-api';
import {
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { Share } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { Players } from './players';
import { Publish } from './publish';

export const ShareMenu = () => {
  const { rulesetId } = useParams();
  const { canPublish } = useRuleset(rulesetId);

  return (
    <Popover>
      <PopoverTrigger>
        <IconButton variant='ghost' aria-label='Share'>
          <Share />
        </IconButton>
      </PopoverTrigger>

      <PopoverContent sx={{ width: '600px', maxWidth: '90dvw', minHeight: '200px' }}>
        <Stack>
          <Tabs>
            <TabList>
              <Tab>Players</Tab>
              {canPublish && <Tab>Publish</Tab>}
            </TabList>

            <TabPanels>
              <TabPanel>
                <Players />
              </TabPanel>
              {canPublish && (
                <TabPanel>
                  <Publish />
                </TabPanel>
              )}
            </TabPanels>
          </Tabs>
        </Stack>
      </PopoverContent>
    </Popover>
  );
};
