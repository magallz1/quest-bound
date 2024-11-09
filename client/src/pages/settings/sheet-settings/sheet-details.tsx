import {
  Archetype,
  Image,
  Sheet,
  SheetDetails,
  SheetTab,
  useCharacter,
  useDeletePage,
  useDeleteSheet,
  useGetSheet,
  usePage,
  useUpdatePage,
  useUpdateSheet,
} from '@/libs/compass-api';
import { ArchetypeLookup, ImageWithUpload } from '@/libs/compass-core-composites';
import { DeleteButton, Divider } from '@/libs/compass-core-ui';
import { SettingsContext } from '@/libs/compass-web-utils';
import {
  Editable,
  EditableInput,
  EditablePreview,
  FormControl,
  FormLabel,
  Stack,
  Switch,
  Text,
} from '@chakra-ui/react';
import { useContext } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';
import { GridStyle } from './grid-style';
import { SaveAsTemplate } from './save-as-template';
import { SheetDefaults } from './sheet-defaults';
import StreamTabSelect from './stream-tab-select';

export const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string(),
});

export const SheetDetailsMenu = () => {
  const { characterId, rulesetId, sheetId } = useParams();
  const [searchParams] = useSearchParams();
  const pageId = searchParams.get('page');

  const { character } = useCharacter(characterId);

  const { openSettingsModal } = useContext(SettingsContext);
  const { sheet: _sheet } = useGetSheet(sheetId);
  const { page } = usePage(pageId ?? _sheet?.pageId ?? '');

  const sheet = character?.sheet ?? _sheet ?? page?.sheet;

  const title = page?.title ?? sheet?.title;

  const { deleteSheet, loading: deleting } = useDeleteSheet();
  const { updateSheet } = useUpdateSheet();
  const { updatePage, loading: updatingPage } = useUpdatePage();
  const { deletePage, loading: deletingPage } = useDeletePage();

  const tabs = JSON.parse(sheet?.tabs ?? '[]') as SheetTab[];

  const navigate = useNavigate();

  const templateType = sheet?.templateType;

  const sheetIsPage = !!sheet?.pageId || !!page;

  const handleUpdate = async (updates: Partial<Sheet>) => {
    if (!sheet) return;
    updateSheet({
      input: {
        id: sheet.id,
        ...updates,
      },
    });

    if (sheetIsPage) {
      updatePage({
        id: sheet.pageId!,
        ...updates,
      });
    }
  };

  const setDetails = (updates: SheetDetails) => {
    if (!sheet) return;
    updateSheet({
      input: {
        id: sheet.id,
        details: JSON.stringify({
          ...details,
          ...updates,
        }),
      },
    });
  };

  const setImage = (image: Image | null) => {
    if (!sheet) return;
    updateSheet({
      input: {
        id: sheet.id,
        imageId: image?.id ?? null,
      },
    });
  };

  const handleDeleteSheet = async () => {
    if (!sheet) return;
    await deleteSheet(sheet.id);
    openSettingsModal(false);
    navigate(`/rulesets/${rulesetId}?selected=templates`);
  };

  const handleDeletePage = async () => {
    if (!sheetIsPage) return;
    await deletePage(page.id ?? sheet.pageId);
    openSettingsModal(false);
    if (characterId) {
      navigate(`/rulesets/${rulesetId}/characters/${characterId}?selected=sheet`);
    } else {
      navigate(`/rulesets/${rulesetId}?selected=page-templates`);
    }
  };

  const applyArchetype = (archetype: Archetype | null) => {
    if (!sheetIsPage) return;
    updatePage({
      id: sheet.pageId ?? page.id,
      archetypeId: archetype?.id ?? null,
    });
  };

  if (!sheet) return null;
  const details = JSON.parse(sheet.details ?? '{}') as SheetDetails;

  return (
    <Stack spacing={4} padding={2} sx={{ flexGrow: 1, overflowY: 'auto' }}>
      <Stack spacing={1}>
        <Text sx={{ opacity: 0.7 }}>Sheet Settings</Text>
        <Divider />
      </Stack>

      <Stack direction='row' spacing={2} flexWrap='wrap'>
        {sheetIsPage && !characterId && <SaveAsTemplate />}
        {!!templateType && (
          <DeleteButton
            title={`Delete ${title}?`}
            label='Delete Template'
            style={{ width: 150 }}
            loading={deleting}
            onDelete={handleDeleteSheet}
          />
        )}
        {sheetIsPage && (
          <DeleteButton
            title={`Delete page?`}
            label='Delete Page'
            style={{ width: 150 }}
            loading={deletingPage}
            onDelete={handleDeletePage}
          />
        )}
      </Stack>

      {title && (
        <Editable
          defaultValue={title}
          onSubmit={(title) => handleUpdate({ title })}
          fontSize='1.5rem'>
          <EditablePreview />
          <EditableInput />
        </Editable>
      )}

      {!sheetIsPage && !!templateType && (
        <ImageWithUpload
          src={sheet?.image?.src ?? ''}
          onRemove={() => setImage(null)}
          onSelect={setImage}
          containerStyle={{ height: 150, width: 150 }}
          imageStyle={{ height: 150, width: 150 }}
        />
      )}

      <Stack direction='row' spacing={8} alignItems='center'>
        <GridStyle details={details} setDetails={setDetails} />

        {!sheetIsPage && <StreamTabSelect tabs={tabs} characterId={characterId} />}
      </Stack>

      <FormControl display='flex' alignItems='center'>
        <FormLabel htmlFor='snapToGrid' mb='0'>
          Snap to Grid
        </FormLabel>
        <Switch
          id='snapToGrid'
          isChecked={details.snapToGrid}
          onChange={(e) => setDetails({ snapToGrid: e.target.checked })}
        />
      </FormControl>

      {!!characterId && !sheetIsPage && (
        <FormControl display='flex' alignItems='center'>
          <FormLabel htmlFor='enableLogic' mb='0'>
            Enable logic
          </FormLabel>
          <Switch
            id='enableLogic'
            isChecked={details.enableLogic}
            onChange={(e) => setDetails({ enableLogic: e.target.checked })}
          />
        </FormControl>
      )}

      {!characterId && sheetIsPage && (
        <Stack spacing={2}>
          <Text>Apply archetype to page</Text>

          <ArchetypeLookup
            archetypeId={page?.archetypeId ?? undefined}
            onSelect={applyArchetype}
            loading={updatingPage}
          />
          <Text fontSize='0.9rem'>
            Replaces variables with data from an archetype, such as name, image and attribute
            default values.
          </Text>
        </Stack>
      )}

      <SheetDefaults />
    </Stack>
  );
};
