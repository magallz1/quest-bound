import { blockStyleFn, Editor as DraftEditor, EditorRef, focusOnEditor } from 'contenido';
import { DraftEditorCommand, EditorState, getDefaultKeyBinding, RichUtils } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { KeyboardEvent } from 'react';
import './editor.css';
import { styleMap } from './toolbar';

export function focusEditor(editorRef: EditorRef) {
  focusOnEditor(editorRef);
}

interface Props {
  state: EditorState;
  onChange: (state: EditorState) => void;
  readOnly?: boolean;
  editorRef: EditorRef;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const Editor = ({ state, onChange, readOnly, editorRef, onFocus, onBlur }: Props) => {
  const handleChange = (state: EditorState) => {
    onChange(state);
  };

  const handleKeyCommand = (command: DraftEditorCommand, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      onChange(newState);
      return 'handled';
    }

    return 'not-handled';
  };

  const mapKeyToEditorCommand = (e: KeyboardEvent): DraftEditorCommand | null => {
    if (e.key === 'Tab') {
      const newEditorState = RichUtils.onTab(e, state, 4 /* maxDepth */);
      if (newEditorState !== state) {
        onChange(newEditorState);
      }
      return null;
    }
    return getDefaultKeyBinding(e);
  };

  return (
    <DraftEditor
      editorState={state}
      onFocus={onFocus}
      onBlur={onBlur}
      editorRef={editorRef ?? undefined}
      readOnly={readOnly}
      spellCheck
      blockStyleFn={blockStyleFn}
      onChange={handleChange}
      handleKeyCommand={handleKeyCommand}
      customStyleMap={styleMap}
      keyBindingFn={(e) => mapKeyToEditorCommand(e as KeyboardEvent)}
    />
  );
};
