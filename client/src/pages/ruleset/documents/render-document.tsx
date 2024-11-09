import { useDocument } from '@/libs/compass-api';
import { Loader, Stack } from '@/libs/compass-core-ui';
import { CSSProperties } from 'react';
import { useSearchParams } from 'react-router-dom';

interface Props {
  style?: CSSProperties;
}

export const RenderDocument = ({ style }: Props) => {
  const [searchParams] = useSearchParams();
  const documentId = searchParams.get('documentId') ?? '';

  const { document, loading } = useDocument(documentId);

  return (
    <Stack
      sx={{ height: 'calc(100vh - 60px)', ...style }}
      alignItems='center'
      justifyContent='center'>
      {loading ? (
        <Loader color='info' />
      ) : !!document ? (
        <object data={document.fileKey} type='application/pdf' width='100%' height='100%'>
          <p>Failed to load {document.title}</p>
        </object>
      ) : null}
    </Stack>
  );
};
