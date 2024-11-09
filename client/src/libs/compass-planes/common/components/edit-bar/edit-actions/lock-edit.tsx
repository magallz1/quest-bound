import { SheetComponent } from '@/libs/compass-api';
import { IconButton, Tooltip } from '@/libs/compass-core-ui';
import { Lock, LockOpen } from '@mui/icons-material';
import { useEditorStore } from '../../../editor-store';

export const LockEdit = ({ components }: { components: SheetComponent[] }) => {
  const { sheetId, updateComponents } = useEditorStore();

  const unlockedComponents = components.filter((c) => !c.locked);
  const anyComponentIsLocked = unlockedComponents.length !== components.length;

  const handleLock = (locked: boolean) => {
    updateComponents(
      {
        sheetId,
        updates: components.map((comp) => ({
          id: comp.id,
          locked,
        })),
      },
      true,
    );
  };

  return (
    <>
      {anyComponentIsLocked && (
        <Tooltip title='Unlock'>
          <IconButton onClick={() => handleLock(false)} sx={{ color: 'secondary.main' }}>
            <Lock fontSize='small' />
          </IconButton>
        </Tooltip>
      )}

      {!anyComponentIsLocked && (
        <Tooltip title='Lock'>
          <IconButton onClick={() => handleLock(true)}>
            <LockOpen fontSize='small' />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
};
