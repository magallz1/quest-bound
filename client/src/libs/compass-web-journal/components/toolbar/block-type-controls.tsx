import { IconButton, Text } from '@/libs/compass-core-ui';
import { FormatListBulleted, FormatListNumbered, FormatQuote } from '@mui/icons-material';
import { isBlockquote, toggleBlockquote } from 'contenido';
import { EditorState, RichUtils } from 'draft-js';

const BLOCK_TYPES = [
  { label: 'H1', style: 'header-one', icon: <Text fontSize='0.9rem'>H1</Text> },
  { label: 'H2', style: 'header-two', icon: <Text fontSize='0.9rem'>H2</Text> },
  {
    label: 'H3',
    style: 'header-three',
    icon: <Text fontSize='0.9rem'>H3</Text>,
  },
  {
    label: 'H4',
    style: 'header-four',
    icon: <Text fontSize='0.9rem'>H4</Text>,
  },
  {
    label: 'H5',
    style: 'header-five',
    icon: <Text fontSize='0.9rem'>H5</Text>,
  },
  { label: 'H6', style: 'header-six', icon: <Text fontSize='0.9rem'>H6</Text> },
  {
    label: 'UL',
    style: 'unordered-list-item',
    icon: <FormatListBulleted fontSize='small' />,
  },
  {
    label: 'OL',
    style: 'ordered-list-item',
    icon: <FormatListNumbered fontSize='small' />,
  },
];

interface Props {
  state: EditorState;
  onChange: (state: EditorState) => void;
}

export const BlockTypeControls = ({ state, onChange }: Props) => {
  const selection = state.getSelection();
  const blockType = state.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();

  const applyType = (type: string) => {
    onChange(RichUtils.toggleBlockType(state, type));
  };

  return (
    <>
      {BLOCK_TYPES.map((type) => (
        <IconButton
          key={type.label}
          title={type.label}
          onClick={() => applyType(type.style)}
          color={blockType === type.style ? 'secondary' : 'inherit'}>
          {type.icon}
        </IconButton>
      ))}
      <IconButton
        color={isBlockquote(state) ? 'secondary' : 'inherit'}
        onClick={() => toggleBlockquote(state, onChange)}>
        <FormatQuote fontSize='small' />
      </IconButton>
    </>
  );
};
