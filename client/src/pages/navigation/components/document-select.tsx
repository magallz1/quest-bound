import { useDocuments, useRuleset } from '@/libs/compass-api';
import { Loader, Stack, Text } from '@/libs/compass-core-ui';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

interface Props {
  filterValue?: string;
}

export const DocumentSelect = ({ filterValue }: Props) => {
  const { documents, loading } = useDocuments();
  const { rulesetId, characterId } = useParams();
  const { ruleset } = useRuleset(rulesetId);
  const details = JSON.parse(ruleset?.details ?? '{}');
  const { documentFileId } = details;

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const filteredDocuments = documents
    .filter((document) => document.title.toLowerCase().includes(filterValue?.toLowerCase() ?? ''))
    .filter((document) => document.id !== documentFileId)
    .sort((a, b) => a.title.localeCompare(b.title));

  const handleSelect = (id: string) => {
    navigate(`rulesets/${rulesetId}/characters/${characterId}/documents?documentId=${id}`);
  };

  return (
    <Stack
      height='100%'
      width='100%'
      pl={2}
      pr={2}
      sx={{ maxWidth: 240, overflowY: 'auto', maxHeight: '50vh' }}>
      {loading && <Loader color='info' />}
      {filteredDocuments.map((document) => (
        <Text
          className='clickable'
          key={document.id}
          sx={{
            fontSize: '0.9rem',
            color: document.id === searchParams.get('documentId') ? 'secondary.main' : 'inherit',
          }}
          onClick={() => handleSelect(document.id)}>
          {document.title}
        </Text>
      ))}
    </Stack>
  );
};
