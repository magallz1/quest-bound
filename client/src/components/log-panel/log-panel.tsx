import { Button, Input, Panel, Stack, Text } from '@/libs/compass-core-ui';
import { EventLog, LogType, useEventLog } from '@/stores';
import { useState } from 'react';

const logTypeToColor = new Map<LogType, string>([
  [LogType.LOGIC, 'text.primary'],
  [LogType.SIDE_EFFECT, 'text.primary'],
  [LogType.CONTROLLED, 'text.primary'],
  [LogType.ACTION, 'text.primary'],
  [LogType.ERROR, 'error.main'],
  [LogType.DICE, 'secondary.main'],
]);

export const LogPanel = () => {
  const { logPanelOpen, setLogPanelOpen, events, clearEvents } = useEventLog();
  const [filterValue, setFilterValue] = useState<string>('');

  const constructEventPrefix = (event: EventLog): EventLog => {
    let msg = `[${event.type}`;
    msg += event.source ? ` of ${event.source}]` : ']';
    msg += ` ${event.message}`;
    return {
      ...event,
      message: msg,
    };
  };

  const messages = events.map((event) => constructEventPrefix(event));
  const filteredMessages = messages.filter((event) =>
    event.message.toLowerCase().includes(filterValue.toLowerCase()),
  );

  return (
    <Panel
      title='Event Log'
      open={logPanelOpen}
      onClose={() => setLogPanelOpen(false)}
      style={{
        backgroundColor: 'background.default',
        paddingTop: '80px',
      }}>
      <Stack spacing={1} width='80%' justifyContent='space-between' sx={{ overflowY: 'auto' }}>
        <Stack width='100%' justifyContent='space-between' direction='row'>
          <Input
            id='event-log-filter'
            placeholder='Filter'
            width={200}
            ignoreHelperText
            sx={{ padding: 1 }}
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />

          <Button variant='text' onClick={clearEvents}>
            Clear
          </Button>
        </Stack>
        <Stack justifyContent='flex-end' pb={4} spacing={0} pl={1} pr={1}>
          {filteredMessages.map((event, index) => (
            <Stack direction='row' spacing={1} key={index}>
              <Text
                sx={{
                  fontSize: '0.9rem',
                  color: logTypeToColor.get(event.type),
                }}>
                {event.message}
              </Text>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Panel>
  );
};
