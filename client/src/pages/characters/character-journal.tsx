import { Stack } from '@/libs/compass-core-ui';
import { useLocation } from 'react-router-dom';
import { RulebookPage } from '../ruleset/rulebook/components/rulebook-page';

interface CharacterJournalProps {
  viewMode?: boolean;
}

export const CharacterJournal = ({ viewMode }: CharacterJournalProps) => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const pageId = queryParams.get('page');

  return (
    <Stack sx={{ flexGrow: 1, height: '100%' }}>
      <RulebookPage pageId={pageId} journal viewMode={viewMode} />
    </Stack>
  );
};
