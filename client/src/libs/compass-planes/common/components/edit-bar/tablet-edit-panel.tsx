import { useDeviceSize } from '@/libs/compass-core-ui';
import { Add, Delete } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { ReactNode } from 'react';
import { Panel } from 'reactflow';
import { useEditorStore } from '../../editor-store';

interface TabletEditPanelProps {
  children: ReactNode;
  setContextMenu: (coordinates: { x: number; y: number } | null) => void;
  onDelete: (ids: string[]) => void;
  viewMode: boolean;
}

export const TabletEditPanel = ({
  children,
  setContextMenu,
  onDelete,
  viewMode,
}: TabletEditPanelProps) => {
  const { desktop } = useDeviceSize();
  const { selectedComponentIds } = useEditorStore();

  return (
    <Panel position='top-right'>
      {children}
      {!desktop && !viewMode && (
        <>
          <IconButton onClick={() => setContextMenu({ x: 1000, y: 200 })} sx={{ fontSize: '2rem' }}>
            <Add />
          </IconButton>
          {selectedComponentIds.length > 0 && (
            <IconButton onClick={() => onDelete(selectedComponentIds)}>
              <Delete sx={{ fontSize: '2rem' }} />
            </IconButton>
          )}
        </>
      )}
    </Panel>
  );
};
