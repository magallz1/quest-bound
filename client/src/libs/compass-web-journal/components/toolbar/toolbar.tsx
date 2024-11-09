import { Stack } from '@chakra-ui/react';
import { EditorState } from 'draft-js';
import { BlockTypeControls } from './block-type-controls';
import { FontFamily } from './font-family';
import { FontSize } from './font-size';
import { InlineStyleControls } from './inline-style-controls';
import { LinkControls } from './link-controls';

export type JournalTool = 'font-family' | 'font-size' | 'inline-style' | 'block-type' | 'link';

interface Props {
  readOnly?: boolean;
  state: EditorState;
  onChange: (state: EditorState) => void;
  onBlur?: () => void;
  onPointerLeave?: () => void;
  disallowedTools?: JournalTool[];
  targetId?: string;
  maxWidth?: string;
}

export const JournalToolbar = ({
  state,
  onChange,
  onBlur,
  onPointerLeave,
  readOnly,
  disallowedTools,
  maxWidth,
}: Props) => {
  const allowed = (tool: JournalTool) =>
    !disallowedTools ? true : disallowedTools.indexOf(tool) === -1;

  if (readOnly) return null;

  return (
    <Stack
      direction='row'
      gap={1}
      minHeight={'40px'}
      padding={1}
      onBlur={onBlur}
      onPointerLeave={onPointerLeave}
      sx={{ maxWidth, flexWrap: 'wrap', backgroundColor: 'rgba(66, 64, 61, 0.6)' }}
      align='center'>
      {allowed('font-family') && <FontFamily state={state} onChange={onChange} />}
      {allowed('font-size') && <FontSize state={state} onChange={onChange} />}
      {allowed('inline-style') && <InlineStyleControls state={state} onChange={onChange} />}
      {allowed('block-type') && <BlockTypeControls state={state} onChange={onChange} />}
      {allowed('link') && <LinkControls state={state} onChange={onChange} />}
    </Stack>
  );
};
