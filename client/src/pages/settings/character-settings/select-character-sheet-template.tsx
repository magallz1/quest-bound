import { Sheet, useCharacter, useSheetTemplates, useUpdateCharacter } from '@/libs/compass-api';
import { Img, TemplateLookup } from '@/libs/compass-core-composites';
import { Confirm, Loader, Stack, Text } from '@/libs/compass-core-ui';
import React from 'react';
import { useParams } from 'react-router-dom';

export const SelectCharacterSheetTemplate = () => {
  const { characterId } = useParams();
  const { character, loading: loadingCharacter } = useCharacter(characterId);

  const { sheets: templates, loading: loadingTemplates } = useSheetTemplates();

  const [template, setTemplate] = React.useState<Sheet | null>(null);

  const { updateCharacter, loading } = useUpdateCharacter();

  const handleReplace = async () => {
    if (!character || !template) return;
    await updateCharacter({
      id: character.id,
      templateId: template.id,
    });

    setTemplate(null);
  };

  const selectedTemplate = templates.find((s) => s.id === character?.sheet?.templateId);

  if (!character) return null;

  return (
    <>
      <Stack flexGrow={1} spacing={4}>
        {loadingTemplates && <Loader color='info' />}

        {!!selectedTemplate && (
          <Stack direction='row' spacing={2} alignItems='center'>
            <Img src={selectedTemplate?.image?.src ?? ''} />
            <Text>{selectedTemplate.title}</Text>
          </Stack>
        )}

        <Stack spacing={1}>
          <Text>Apply new template</Text>
          <TemplateLookup
            rulesetId={character.rulesetId}
            filterIds={[character.sheet?.templateId ?? '']}
            published
            loading={loadingCharacter || loadingTemplates}
            onSelect={setTemplate}
          />
        </Stack>
      </Stack>

      <Confirm
        title={`Replace sheet with ${template?.title ?? 'new template'}?`}
        loading={loading}
        open={!!template}
        onClose={() => setTemplate(null)}
        onConfirm={handleReplace}>
        <Text>The existing sheet and any edits made will be deleted.</Text>
        <Text>All existing character attributes will be added to the new sheet.</Text>
      </Confirm>
    </>
  );
};
