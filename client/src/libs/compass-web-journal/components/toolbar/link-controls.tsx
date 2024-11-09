import { Page } from '@/libs/compass-api';
import { PageLookup } from '@/libs/compass-core-composites';
import { IconButton, Menu, Stack } from '@/libs/compass-core-ui';
import { Link } from '@mui/icons-material';
import { addLink, removeLink } from 'contenido';
import { EditorState } from 'draft-js';
import React from 'react';
import { useParams } from 'react-router-dom';
import { addPageLink } from '../decorators/link';

interface Props {
  state: EditorState;
  onChange: (state: EditorState) => void;
}

export const LinkControls = ({ state, onChange }: Props) => {
  const { characterId } = useParams();

  const selection = state.getSelection();
  const selectedEntityKey = state
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getEntityAt(selection.getStartOffset());

  const isLink = Boolean(
    selectedEntityKey &&
      state.getCurrentContent().getEntity(selectedEntityKey).getType() === 'link',
  );

  const isPageLink = Boolean(
    selectedEntityKey &&
      state.getCurrentContent().getEntity(selectedEntityKey).getType() === 'page-link',
  );

  const entityData =
    isLink || isPageLink
      ? state.getCurrentContent().getEntity(selectedEntityKey).getData()
      : { href: '', pageId: '', pageTitle: '' };

  const [menuEl, setMenuEl] = React.useState<null | HTMLElement>(null);

  const handleAddLink = (href: string) => {
    addLink(state, onChange, {
      href,
    });
  };

  const handleAddPageLink = (page: Page | null) => {
    if (!page) {
      handleRemoveLink();
      return;
    }
    addPageLink(state, onChange, {
      pageId: page.id,
      rulesetId: page.rulesetId ?? undefined,
      characterId,
    });
  };

  const handleRemoveLink = () => removeLink(state, onChange);

  return (
    <>
      <IconButton
        onClick={(e) => setMenuEl(e.currentTarget)}
        color={isLink || isPageLink ? 'secondary' : 'inherit'}>
        <Link fontSize='small' />
      </IconButton>
      <Menu open={!!menuEl} anchorEl={menuEl} onClose={() => setMenuEl(null)}>
        <Stack padding={1}>
          <PageLookup
            pageId={entityData.pageId}
            defaultUrl={entityData.href}
            onSelect={handleAddPageLink}
            onEnterUrl={handleAddLink}
          />
        </Stack>
      </Menu>
    </>
  );
};
