import { FontSizeSelect } from '@/libs/compass-core-ui';
import { EditorState, RichUtils } from 'draft-js';
import debounce from 'lodash.debounce';
import React, { useMemo } from 'react';

interface Props {
  state: EditorState;
  onChange: (state: EditorState) => void;
}

export const FontSize = ({ state, onChange }: Props) => {
  const currentStyle = state.getCurrentInlineStyle();

  const getCurrentSize = () => {
    let selectedSize = '16px';

    currentStyle.forEach((entry) => {
      if (entry && !isNaN(parseInt(entry))) selectedSize = entry;
    });

    return selectedSize;
  };

  const [newValue, setNewValue] = React.useState<number>(parseInt(getCurrentSize()));

  const applyStyle = (style: string, state: EditorState) => {
    const currentStyle = state.getCurrentInlineStyle();
    const selection = state.getSelection();
    const selectionStyle = state
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getInlineStyleAt(selection.getStartOffset());

    let newState: EditorState = state;

    const currentSizeSet = new Set<string>();

    selectionStyle.forEach((entry) => {
      if (entry) {
        currentSizeSet.add(entry);
      }
    });

    currentStyle.forEach((entry) => {
      if (entry) {
        currentSizeSet.add(entry);
      }
    });

    // Remove existing font sizes
    [...currentSizeSet].forEach((entry) => {
      newState = RichUtils.toggleInlineStyle(newState, entry);
    });

    // Add new font size
    newState = RichUtils.toggleInlineStyle(newState, style);
    onChange(newState);
  };

  const debouncedApplyStyle = useMemo(
    () =>
      debounce((value: number, state: EditorState) => {
        // Pulled from journal custom style map
        const newValue = Math.max(10, Math.min(144, value || 16));
        setNewValue(newValue);
        applyStyle(`${newValue}px`, state);
      }, 500),
    [state],
  );

  const handleChange = (value: number) => {
    setNewValue(value);
    debouncedApplyStyle(value, state);
  };

  return <FontSizeSelect onChange={handleChange} value={newValue} />;
};
