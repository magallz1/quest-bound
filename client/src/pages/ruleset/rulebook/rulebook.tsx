import { RulebookLoading } from '@/components/rulebook-loading';
import { RulebookDocumentContext, useDocument, useRuleset } from '@/libs/compass-api';
import { Stack } from '@/libs/compass-core-ui';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useLocation, useParams } from 'react-router-dom';
import { RulebookPage } from './components/rulebook-page';

interface RulebookProps {
  viewMode?: boolean;
}

export const Rulebook = ({ viewMode = false }: RulebookProps) => {
  const { rulesetId } = useParams();
  const { details } = useRuleset(rulesetId);
  const { documentFileId } = details;

  const { document } = useDocument(documentFileId);
  const documentFileSrc = document?.fileKey;

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const pageId = queryParams.get('page');

  return (
    <Stack sx={{ flexGrow: 1, height: '100%' }}>
      {documentFileId ? (
        <RulebookDocumentContext
          file={documentFileSrc}
          loading={<RulebookLoading />}
          noData=' '
          error='Error loading document'>
          <RulebookPage pageId={pageId} viewMode={viewMode} />
        </RulebookDocumentContext>
      ) : (
        <RulebookPage pageId={pageId} viewMode={viewMode} />
      )}
    </Stack>
  );
};
