import { IconButton } from '@/libs/compass-core-ui';
import {
  FormatAlignCenter,
  FormatAlignLeft,
  FormatAlignRight,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
} from '@mui/icons-material';
import { isTextCenterAligned, isTextLeftAligned, toggleTextAlign } from 'contenido';
import { EditorState, RichUtils } from 'draft-js';

const INLINE_STYLES = [
  { label: 'Bold', style: 'BOLD', icon: <FormatBold fontSize='small' /> },
  { label: 'Italic', style: 'ITALIC', icon: <FormatItalic fontSize='small' /> },
  {
    label: 'Underline',
    style: 'UNDERLINE',
    icon: <FormatUnderlined fontSize='small' />,
  },
];

interface Props {
  state: EditorState;
  onChange: (state: EditorState) => void;
}

export const InlineStyleControls = ({ state, onChange }: Props) => {
  const currentStyle = state.getCurrentInlineStyle();

  const applyStyle = (style: string) => {
    onChange(RichUtils.toggleInlineStyle(state, style));
  };

  const applyAlignment = () => {
    if (isTextLeftAligned(state)) {
      toggleTextAlign(state, onChange, 'text-align-center');
    } else if (isTextCenterAligned(state)) {
      toggleTextAlign(state, onChange, 'text-align-right');
    } else {
      toggleTextAlign(state, onChange, 'text-align-left');
    }
  };

  return (
    <>
      {INLINE_STYLES.map((style) => (
        <IconButton
          title={style.label}
          key={style.label}
          color={currentStyle.has(style.style) ? 'secondary' : 'inherit'}
          onClick={() => applyStyle(style.style)}>
          {style.icon}
        </IconButton>
      ))}
      <IconButton onClick={applyAlignment}>
        {isTextLeftAligned(state) ? (
          <FormatAlignLeft fontSize='small' />
        ) : isTextCenterAligned(state) ? (
          <FormatAlignCenter fontSize='small' />
        ) : (
          <FormatAlignRight fontSize='small' />
        )}
      </IconButton>
    </>
  );
};
