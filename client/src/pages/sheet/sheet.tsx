import {
  AttributeProvider,
  Character,
  ComponentTypes,
  SheetType,
  SheetView,
  useCharacters,
  useCreateCharacter,
  useGetSheet,
} from '@/libs/compass-api';
import { Stack, Text } from '@/libs/compass-core-ui';
import { SheetEditor } from '@/libs/compass-planes/sheet-editor/sheet-editor';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { AttributeLogicEditor } from '../ruleset';
import { useAttributeState } from '../ruleset/attributes/attribute-store';
import { EditControls } from './components';

interface Props {
  viewMode?: boolean;
}

export const SheetPage = ({ viewMode = false }: Props) => {
  const { rulesetId, sheetId } = useParams();
  const { sheet } = useGetSheet(sheetId);
  const { characters, loading: charactersLoading } = useCharacters();
  const { createCharacter } = useCreateCharacter();

  const [searchParams, setSearchParams] = useSearchParams();
  const attributeId = searchParams.get('attributeId');

  const [templateCharacter, setTemplateCharacter] = useState<Character | null>(null);

  const attributeState = useAttributeState(templateCharacter?.id);

  useEffect(() => {
    const createTemplateCharacter = async () => {
      if (!rulesetId) return;
      const char = await createCharacter(
        {
          rulesetId,
          name: 'Template Character',
          createdFromPublishedRuleset: false,
        },
        { cacheOnly: true },
        sheet,
      );

      setTemplateCharacter(char);
    };

    if (charactersLoading || !sheet) return;

    const templateCharacter =
      sheet?.type !== SheetType.TEMPLATE
        ? null
        : characters.find((c) => c.sheet?.id === sheetId) ?? null;

    if (templateCharacter) {
      setTemplateCharacter(templateCharacter);
    } else {
      createTemplateCharacter();
    }
  }, [charactersLoading, sheet]);

  const Title = () => (
    <Stack alignItems='center' style={{ userSelect: 'none' }}>
      <Text>{sheet?.title ?? ''}</Text>
      {sheet?.type === SheetType.TEMPLATE && viewMode && (
        <Text variant='subtitle2' fontStyle='italic'>
          Preview - changes will not be saved
        </Text>
      )}
    </Stack>
  );

  return (
    <AttributeProvider value={attributeState}>
      <SheetEditor
        sheet={sheet}
        loading={!templateCharacter}
        disableSelection={!!attributeId}
        viewMode={viewMode}
        title={<Title />}
        excludeComponentTypes={[ComponentTypes.CHART, ComponentTypes.PDF]}
        characterId={templateCharacter?.id}
        controls={
          <EditControls sheet={sheet} sheetView={viewMode ? SheetView.PLAY : SheetView.EDIT} />
        }
        cacheOnly={!!templateCharacter && viewMode}
      />
      <AttributeLogicEditor
        overrideAttributeId={attributeId ?? undefined}
        fullWidth
        onClose={() => {
          searchParams.delete('attributeId');
          setSearchParams(searchParams);
        }}
      />
    </AttributeProvider>
  );
};
