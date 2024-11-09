import { Sheet, TemplateType, useCharacter, useCreatePage, usePages } from '@/libs/compass-api';
import { TemplateLookup } from '@/libs/compass-core-composites';
import { Loader } from '@/libs/compass-core-ui';
import { Button, Popover, PopoverContent, PopoverTrigger, Stack } from '@chakra-ui/react';
import { Add, NoteAdd } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface CreatePageButtonsProps {
  selectedPageId?: string | null;
  onCreate?: () => void;
}

export const CreatePageButtons = ({ selectedPageId, onCreate }: CreatePageButtonsProps) => {
  const { rulesetId, characterId } = useParams();
  const { createPage, loading } = useCreatePage();
  const { pages: rulebookPages } = usePages();
  const { character } = useCharacter(characterId);
  const journalPages = character?.pages ?? [];

  const [isOpen, setIsOpen] = useState(false);

  const pages = !!characterId ? journalPages : rulebookPages;

  const navigate = useNavigate();

  const goToPage = (pageId: string) => {
    if (!!characterId) {
      navigate(`rulesets/${rulesetId}/characters/${characterId}/journal?page=${pageId}`);
    } else {
      navigate(`/rulesets/${rulesetId}/rulebook/edit?page=${pageId}`);
    }
  };

  const handleCreate = async (selectedTemplate?: Sheet | null) => {
    const siblings = !selectedPageId
      ? pages.filter((page) => !page.parentId)
      : pages.filter((page) => page.parentId === selectedPageId);

    const res = await createPage({
      title: `Page ${pages.length + 1}`,
      parentId: selectedPageId,
      characterId,
      sortIndex: siblings.length,
      templateId: selectedTemplate?.id,
    });

    if (res) {
      onCreate?.();
      goToPage(res.id);
    }
  };

  return (
    <>
      <Stack spacing={2} pl={1} pr={1} overflowY='visible'>
        {loading ? (
          <Loader color='info' />
        ) : (
          <>
            <Button
              variant='text'
              onClick={() => handleCreate()}
              rightIcon={<Add fontSize='small' />}>
              Add Blank Page
            </Button>
            {!characterId && (
              <Popover isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <PopoverTrigger>
                  <Button
                    variant='text'
                    rightIcon={<NoteAdd fontSize='small' />}
                    onClick={() => setIsOpen(true)}>
                    Add Page from Template
                  </Button>
                </PopoverTrigger>
                <PopoverContent sx={{ width: 225, padding: 2, alignItems: 'center' }}>
                  {isOpen && (
                    <TemplateLookup
                      rulesetId={rulesetId ?? ''}
                      type={TemplateType.PAGE}
                      onSelect={(template) => handleCreate(template)}
                    />
                  )}
                </PopoverContent>
              </Popover>
            )}
          </>
        )}
      </Stack>
    </>
  );
};
