import { FontFamilies, FontSelect } from '@/libs/compass-core-ui';
import { EditorState, RichUtils } from 'draft-js';

interface Props {
  state: EditorState;
  onChange: (state: EditorState) => void;
}

export const FontFamily = ({ state, onChange }: Props) => {
  const currentStyle = state.getCurrentInlineStyle();
  const selection = state.getSelection();
  const selectionStyle = state
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getInlineStyleAt(selection.getStartOffset());

  const getCurrentFamily = () => {
    let selectedFamily = 'Roboto Condensed';

    for (const family of FontFamilies) {
      if (currentStyle.has(family)) {
        selectedFamily = family;
        break;
      }
    }

    return selectedFamily;
  };

  const applyStyle = (style: string) => {
    FontFamilies.forEach((family) => {
      if (selectionStyle.has(family) || currentStyle.has(family)) {
        onChange(RichUtils.toggleInlineStyle(state, family));
      }
    });

    onChange(RichUtils.toggleInlineStyle(state, style));
  };

  return <FontSelect onChange={applyStyle} selected={getCurrentFamily()} />;
};
