import {
  AttributeProvider,
  ComponentTypes,
  RulebookDocumentContext,
  useDocument,
  useGetSheet,
  useRuleset,
} from '@/libs/compass-api';
import { IconButton, Stack, Text } from '@/libs/compass-core-ui';
import { PlaneEditorType, SheetEditor } from '@/libs/compass-planes';
import { EditorLoading } from '@/libs/compass-planes/common/components';
import { SettingsButton } from '@/pages/settings/settings-button';
import { Description, Edit } from '@mui/icons-material';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAttributeState } from '../attributes/attribute-store';

export const EditPageTemplate = () => {
  const { sheetId, rulesetId } = useParams();
  const { details } = useRuleset(rulesetId);
  const { documentFileId } = details;

  const { document, loading: documentLoading } = useDocument(documentFileId);
  const documentFileSrc = document?.fileKey;

  const { sheet, loading } = useGetSheet(sheetId);

  const [viewMode, setViewMode] = useState<boolean>(false);

  const attributeState = useAttributeState();

  if (loading || documentLoading) return <EditorLoading />;
  if (!sheet) return null;

  const Title = () => (
    <Text sx={{ textOverflow: 'ellipsis' }}>
      {sheet?.title ? `Page Template | ${sheet.title}` : 'Page Template'}
    </Text>
  );

  return documentFileId ? (
    <AttributeProvider value={attributeState}>
      <RulebookDocumentContext
        file={documentFileSrc}
        loading={' '}
        noData=' '
        error='Error loading document'>
        <SheetEditor
          type={PlaneEditorType.PAGE}
          sheet={sheet}
          viewMode={viewMode}
          title={<Title />}
          excludeComponentTypes={[
            ComponentTypes.GRAPH,
            ComponentTypes.NOTES,
            ComponentTypes.CANVAS,
            ComponentTypes.CHECKBOX,
            ComponentTypes.INPUT,
          ]}
          controls={
            <Stack direction='row' spacing={2}>
              <IconButton onClick={() => setViewMode((prev) => !prev)}>
                {viewMode ? <Edit fontSize='small' /> : <Description fontSize='small' />}
              </IconButton>
              <SettingsButton defaultPage='sheet-settings' />
            </Stack>
          }
        />
      </RulebookDocumentContext>
    </AttributeProvider>
  ) : (
    <AttributeProvider value={attributeState}>
      <SheetEditor
        type={PlaneEditorType.PAGE}
        sheet={sheet}
        viewMode={viewMode}
        excludeComponentTypes={[
          ComponentTypes.GRAPH,
          ComponentTypes.NOTES,
          ComponentTypes.CANVAS,
          ComponentTypes.CHECKBOX,
          ComponentTypes.INPUT,
        ]}
        title={<Title />}
        controls={
          <Stack direction='row' spacing={2}>
            <IconButton onClick={() => setViewMode((prev) => !prev)}>
              {viewMode ? <Edit fontSize='small' /> : <Description fontSize='small' />}
            </IconButton>
            <SettingsButton defaultPage='sheet-settings' />
          </Stack>
        }
      />
    </AttributeProvider>
  );
};
