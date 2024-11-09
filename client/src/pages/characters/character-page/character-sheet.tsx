import { ComponentTypes, useGetSheet } from '@/libs/compass-api';
import { IconButton } from '@/libs/compass-core-ui';
import { SheetEditor } from '@/libs/compass-planes/sheet-editor/sheet-editor';
import { InventoryPanel } from '@/pages/sheet/components/inventory';
import { Description, Edit } from '@mui/icons-material';
import { useState } from 'react';

interface Props {
  sheetId?: string;
  loading: boolean;
}

export const CharacterSheet = ({ sheetId, loading }: Props) => {
  const [editing, setEditing] = useState<boolean>(false);

  const { sheet, loading: sheetLoading } = useGetSheet(sheetId);

  return (
    <SheetEditor
      sheet={sheet}
      loading={loading || sheetLoading}
      viewMode={!editing}
      excludeComponentTypes={[ComponentTypes.CHART, ComponentTypes.PDF]}
      controls={
        <>
          {!editing && <InventoryPanel />}
          <IconButton
            title={editing ? 'View Sheet' : 'Edit Sheet'}
            onClick={() => setEditing((prev) => !prev)}>
            {editing ? <Description fontSize='small' /> : <Edit fontSize='small' />}
          </IconButton>
        </>
      }
    />
  );
};
