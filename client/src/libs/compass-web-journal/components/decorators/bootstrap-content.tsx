import { createDecorator } from 'contenido';
import { ContentBlock, ContentState, convertFromRaw, EditorState } from 'draft-js';
import { EditorLink } from './link';

export const bootstrapContent = (content?: string): EditorState => {
  let editorContent = null;

  try {
    editorContent = !!content && content !== '{}' ? convertFromRaw(JSON.parse(content)) : null;
  } catch (e) {}

  const decorators = createDecorator([
    {
      component: EditorLink,
      strategy: findLinkEntities,
    },
  ]);

  return editorContent
    ? EditorState.createWithContent(editorContent, decorators)
    : EditorState.createEmpty(decorators);
};

function findLinkEntities(
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState,
) {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      (contentState.getEntity(entityKey).getType() === 'link' ||
        contentState.getEntity(entityKey).getType() === 'page-link')
    );
  }, callback);
}
