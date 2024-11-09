import { IconButton, Tooltip } from '@/libs/compass-core-ui';
import { useEventLog } from '@/stores';
import { ReceiptLong } from '@mui/icons-material';

export const LogPanelButton = () => {
  const { setLogPanelOpen } = useEventLog();

  return (
    <Tooltip title='Event Log'>
      <IconButton onClick={() => setLogPanelOpen(true)}>
        <ReceiptLong fontSize='small' />
      </IconButton>
    </Tooltip>
  );
};
