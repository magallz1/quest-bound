import { IconButton, Tooltip } from '@/libs/compass-core-ui';
import { SettingsContext } from '@/libs/compass-web-utils';
import { Settings } from '@mui/icons-material';
import { useContext } from 'react';

interface Props {
  defaultPage?: string;
}

export const SettingsButton = ({ defaultPage }: Props) => {
  const { openSettingsModal, setSettingsPage } = useContext(SettingsContext);

  const handleOpen = () => {
    if (defaultPage) {
      setSettingsPage(defaultPage);
    }

    openSettingsModal(true);
  };

  return (
    <Tooltip title='Settings'>
      <IconButton onClick={handleOpen}>
        <Settings fontSize='small' />
      </IconButton>
    </Tooltip>
  );
};
