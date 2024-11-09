import { Stack, Text } from '@/libs/compass-core-ui';
import { bootstrapContent, convertToRaw, EditorState, Journal } from '@/libs/compass-web-journal';
import { JournalToolbar } from '@/libs/compass-web-journal/components/toolbar';
import React from 'react';

interface Props {
  value: string;
  onChange?: (value: string) => void;
  loading?: boolean;
  style?: React.CSSProperties;
  readOnly?: boolean;
  id?: string;
  hideLabel?: boolean;
}

export const Description = ({
  value,
  onChange,
  readOnly = false,
  loading = false,
  style,
  id,
  hideLabel = false,
}: Props) => {
  // Serializing and de-serializing causes the selection to be lost
  const [journalState, setJournalState] = React.useState<EditorState>(bootstrapContent(value));

  const handleChange = (content: EditorState) => {
    setJournalState(content);
    onChange?.(JSON.stringify(convertToRaw(content.getCurrentContent())));
  };

  return (
    <Stack sx={{ flexGrow: 1, width: '100%', maxWidth: '730px' }}>
      {!readOnly && !hideLabel && <Text variant='subtitle2'>Description</Text>}
      {/* <div id={id ?? 'journal-toolbar'} style={{ width: '100%' }} /> */}
      <JournalToolbar state={journalState} onChange={setJournalState} />
      <Journal
        className='description'
        toolbarId={id}
        readOnly={readOnly}
        content={journalState}
        onChange={handleChange}
        loading={loading}
        style={{
          backgroundColor: readOnly ? 'transparent' : '#2a2a2a',
          overflowY: 'auto',
          maxHeight: 280,
          minHeight: 150,
          ...style,
        }}
        disallowedTools={['link', 'font-family', 'font-size']}
      />
    </Stack>
  );
};
