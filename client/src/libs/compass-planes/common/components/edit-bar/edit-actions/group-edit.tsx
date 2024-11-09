import { IconButton, Tooltip } from '@/libs/compass-core-ui';
import { AddLink, LinkOff } from '@mui/icons-material';
import { useEditorStore } from '../../../editor-store';
import { useGroupComponents } from '../../../hooks';

export const GroupEdit = () => {
  const { sheetId, selectedComponentIds, components } = useEditorStore();
  const selectedComponents = components.filter((c) => selectedComponentIds.includes(c.id));

  const { handleGroup, handleUngroup } = useGroupComponents(sheetId);

  const unlockedSelectedComponents = selectedComponents.filter((c) => !c.locked);
  const anySelectionIsGroupedComponent =
    unlockedSelectedComponents.filter((comp) => !!comp.groupId).length > 0;

  return (
    <>
      {unlockedSelectedComponents.length > 1 && !anySelectionIsGroupedComponent && (
        <Tooltip title='Group'>
          <IconButton onClick={() => handleGroup(unlockedSelectedComponents)}>
            <AddLink fontSize='small' />
          </IconButton>
        </Tooltip>
      )}

      {anySelectionIsGroupedComponent && (
        <Tooltip title='Ungroup'>
          <IconButton onClick={() => handleUngroup(unlockedSelectedComponents)}>
            <LinkOff fontSize='small' />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
};
