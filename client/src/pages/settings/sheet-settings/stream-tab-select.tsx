import { SheetTab, useCharacter, useUpdateCharacter } from '@/libs/compass-api';
import { EnvContext } from '@/libs/compass-web-utils';
import { useNotifications } from '@/stores';
import { IconButton, Select, Stack, Text, Tooltip } from '@chakra-ui/react';
import { Link } from '@mui/icons-material';
import { useContext } from 'react';

interface Props {
  tabs: SheetTab[];
  characterId?: string | null;
}

const StreamTabSelect = ({ tabs, characterId }: Props) => {
  const { character } = useCharacter(characterId ?? undefined);
  const { updateCharacter } = useUpdateCharacter();
  const { domain } = useContext(EnvContext);
  const { addNotification } = useNotifications();

  const selectedTabId = character?.streamTabId;
  const link = selectedTabId ? `${domain}/stream/${characterId}` : null;

  const setStreamTab = (tabId: string) => {
    if (!character) return;
    updateCharacter({
      id: character.id,
      streamTabId: tabId === 'none' ? null : tabId,
    });
  };

  const copyLink = () => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    addNotification({
      message: 'Stream link copied to clipboard',
    });
  };

  const streamMsg =
    'While streaming, anyone can see a read-only version of the selected tab using the stream link. Select "none" to disabled streaming for this character.';

  if (!character) return null;

  return (
    <Stack spacing={1}>
      <Text>Stream Tab</Text>

      <Stack direction='row' spacing={2} alignItems='center'>
        <Select
          value={selectedTabId ?? 'none'}
          onChange={(e) => setStreamTab?.(e.target.value as string)}>
          <option value='none'>
            <Text>None</Text>
          </option>
          {tabs.map((tab) => (
            <option key={tab.tabId} value={tab.tabId}>
              <Text>{tab.title}</Text>
            </option>
          ))}
        </Select>

        {link && (
          <>
            <Tooltip label={streamMsg}>
              <Text
                className='clickable'
                sx={{
                  textDecoration: 'underline',
                  textWrap: 'nowrap',
                  color: 'secondary.main',
                }}>
                Now Streaming
              </Text>
            </Tooltip>
            <IconButton aria-label='Link to stream page' variant='ghost' onClick={copyLink}>
              <Link />
            </IconButton>
          </>
        )}
      </Stack>
    </Stack>
  );
};

export default StreamTabSelect;
