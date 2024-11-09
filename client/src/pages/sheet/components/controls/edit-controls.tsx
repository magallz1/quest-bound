import { LogPanelButton } from '@/components/log-panel';
import { Sheet, SheetView } from '@/libs/compass-api';
import { IconButton, Stack, Tooltip } from '@/libs/compass-core-ui';
import { SettingsButton } from '@/pages/settings/settings-button';
import { Description, Edit } from '@mui/icons-material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { InventoryPanel } from '../inventory';

interface EditControlsProps {
  sheet?: Sheet;
  sheetView: SheetView;
}

export const EditControls = ({ sheet, sheetView }: EditControlsProps) => {
  const navigate = useNavigate();
  const { rulesetId } = useParams();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const activeTab = queryParams.get('tab') || null;
  const param = activeTab ? `?tab=${activeTab}` : '';

  if (!sheet) return null;

  return (
    <>
      <Stack direction='row' spacing={1}>
        {sheetView === SheetView.PLAY ? (
          <>
            <LogPanelButton />
            <InventoryPanel />
            <Tooltip title='Edit'>
              <IconButton
                onClick={() =>
                  navigate(`/rulesets/${rulesetId}/sheet-templates/${sheet.id}/edit${param}`)
                }>
                <Edit fontSize='small' />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <Tooltip title='Preview'>
            <IconButton
              onClick={() =>
                navigate(`/rulesets/${rulesetId}/sheet-templates/${sheet.id}${param}`)
              }>
              <Description fontSize='small' />
            </IconButton>
          </Tooltip>
        )}

        <SettingsButton defaultPage='sheet-settings' />
      </Stack>
    </>
  );
};
