import { useCharacter } from '@/libs/compass-api';
import { Text } from '@/libs/compass-core-ui';
import { DecoratorComponentProps } from 'contenido';
import { EditorState, RichUtils } from 'draft-js';
import React, { Dispatch, FC, SetStateAction } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Props {
  children?: React.ReactNode;
  href?: string;
  pageId?: string;
  rulesetId?: string;
  characterId?: string;
}

export const EditorLink: FC<DecoratorComponentProps> = ({
  children,
  href,
  pageId,
  rulesetId,
}: Props) => {
  const { characterId } = useParams();
  const navigate = useNavigate();

  const { character } = useCharacter(characterId);

  const isJournalPage = !!character && character.pages.some((p) => p.id === pageId);

  const pageLink = `/rulesets/${rulesetId}/${
    isJournalPage ? 'journal' : 'rulebook'
  }?page=${pageId}`;

  if (href) {
    return (
      <a className='journal-link' href={href} target='_blank' rel='noreferrer'>
        {children}
      </a>
    );
  }

  return (
    <Text
      title='Hold shift to follow link'
      component='span'
      className='journal-link'
      onClick={(e) => {
        if (e.shiftKey) {
          navigate(pageLink);
        }
      }}>
      {children}
    </Text>
  );
};

type PageLinkAttributes = {
  pageId: string;
  rulesetId?: string;
  characterId?: string;
  text?: string;
  children?: React.ReactNode;
};

export type State = EditorState;
export type StateHandler = Dispatch<SetStateAction<State>> | ((state: State) => void);

export function addPageLink(
  state: State,
  stateHandler: StateHandler,
  attributes?: PageLinkAttributes,
) {
  const selection = state.getSelection();
  const selectedEntityKey = state.getCurrentContent().getBlockForKey(selection.getStartKey());

  const contentState = state.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity('page-link', 'IMMUTABLE', {
    ...attributes,
    text: selectedEntityKey.getText(),
  });

  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

  const newEditorState = EditorState.set(state, {
    currentContent: contentStateWithEntity,
  });

  const stateToSet = RichUtils.toggleLink(newEditorState, selection, entityKey);
  stateHandler(stateToSet);
}
