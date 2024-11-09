import { RulebookLoading } from '@/components/rulebook-loading';
import {
  ArchetypeProvider,
  AttributeProvider,
  ComponentTypes,
  useArchetypeState,
  usePage,
  useRuleset,
} from '@/libs/compass-api';
import { IconButton, Skeleton, Stack, Text } from '@/libs/compass-core-ui';
import { PlaneEditorType, SheetEditor } from '@/libs/compass-planes';
import { SettingsButton } from '@/pages/settings/settings-button';
import { Edit, MenuBook } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAttributeState } from '../../attributes/attribute-store';

interface RulebookPageProps {
  pageId: string | null;
  loading?: boolean;
  viewMode?: boolean;
  journal?: boolean;
}

export const RulebookPage = ({
  loading,
  pageId,
  viewMode = false,
  journal = false,
}: RulebookPageProps) => {
  const { rulesetId, characterId } = useParams();
  const canEdit = !characterId || journal;

  const { page, loading: pageLoading, error } = usePage(pageId ?? undefined);
  const { ruleset } = useRuleset(rulesetId);

  const Title = () =>
    loading ? (
      <Skeleton width={80} />
    ) : page && ruleset?.title ? (
      <Text sx={{ textOverflow: 'ellipsis' }}>{`| ${page.title}`}</Text>
    ) : null;

  const archetypeState = useArchetypeState(page?.archetypeId);
  const attributeStateWithCharacter = useAttributeState();
  const attributeStateNoCharacter = useAttributeState();

  // Only reference character attributes within a character journal
  // Rulebook pages should show the default value of attributes or the archetype overrides
  const attributeState = journal ? attributeStateWithCharacter : attributeStateNoCharacter;

  const excludedTypes = [ComponentTypes.GRAPH, ComponentTypes.CHECKBOX, ComponentTypes.INPUT];

  if (!journal) {
    excludedTypes.push(ComponentTypes.NOTES);
    excludedTypes.push(ComponentTypes.CANVAS);
  }

  if (!pageId) {
    return (
      <Stack
        padding={2}
        width='100%'
        direction='row'
        alignItems='center'
        justifyContent='space-between'>
        <Text fontStyle='italic'>Select a Page</Text>
        <Stack spacing={2}>
          <EditControl rulesetId={rulesetId} viewMode={viewMode} canEdit={canEdit} />
        </Stack>
      </Stack>
    );
  }

  if (error) {
    return <Text p={2}>Error loading page</Text>;
  }

  if (pageLoading || loading) {
    return <RulebookLoading />;
  }

  if (!page) return null;

  return (
    <AttributeProvider value={attributeState}>
      <ArchetypeProvider value={archetypeState}>
        <SheetEditor
          sheet={page.sheet}
          type={journal ? PlaneEditorType.JOURNAL : PlaneEditorType.PAGE}
          viewMode={viewMode}
          title={<Title />}
          excludeComponentTypes={excludedTypes}
          controls={
            <EditControl
              pageId={pageId}
              rulesetId={rulesetId}
              characterId={characterId}
              viewMode={viewMode}
              canEdit={canEdit}
            />
          }
        />
      </ArchetypeProvider>
    </AttributeProvider>
  );
};

const EditControl = ({
  rulesetId,
  pageId,
  viewMode = false,
  canEdit = false,
  characterId,
}: {
  rulesetId?: string;
  pageId?: string;
  characterId?: string;
  viewMode?: boolean;
  canEdit?: boolean;
}) => {
  const navigate = useNavigate();

  return viewMode ? (
    canEdit ? (
      <IconButton
        title='Edit Page'
        onClick={() => {
          if (characterId) {
            navigate(
              `/rulesets/${rulesetId}/characters/${characterId}/journal/edit${
                pageId ? `?page=${pageId}` : ''
              }`,
            );
          } else {
            navigate(`/rulesets/${rulesetId}/rulebook/edit${pageId ? `?page=${pageId}` : ''}`);
          }
        }}>
        <Edit fontSize='small' />
      </IconButton>
    ) : null
  ) : (
    <Stack direction='row' spacing={2}>
      <IconButton
        title='View Page'
        onClick={() => {
          if (characterId) {
            navigate(
              `/rulesets/${rulesetId}/characters/${characterId}/journal${
                pageId ? `?page=${pageId}` : ''
              }`,
            );
          } else {
            navigate(`/rulesets/${rulesetId}/rulebook${pageId ? `?page=${pageId}` : ''}`);
          }
        }}>
        <MenuBook fontSize='small' />
      </IconButton>

      <SettingsButton defaultPage='sheet-settings' />
    </Stack>
  );
};
