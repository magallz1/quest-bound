import { useCharacter, usePages, useUpdatePage } from '@/libs/compass-api';
import { SortableTree, TreeItem } from '@/libs/compass-core-composites';
import { PageTreeItem } from '@/types';
import { IconButton, Stack, Tooltip } from '@chakra-ui/react';
import { PostAdd } from '@mui/icons-material';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { buildPageTree, filterTreeWithAncestorsByLabel } from '../utils';
import { CreatePageButtons } from './create-page-buttons';
import { PageTreeLoading } from './page-tree-loading';

interface PageTreeProps {
  readOnly?: boolean;
  hideHeader?: boolean;
  title?: string;
  filterValue?: string;
  journal?: boolean;
}

export const PageTree = ({
  readOnly = false,
  hideHeader = false,
  journal = false,
  filterValue = '',
}: PageTreeProps) => {
  const { rulesetId, characterId } = useParams();

  const { character } = useCharacter(characterId);

  const journalPages = character?.pages ?? [];

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const selectedPageId = queryParams.get('page');

  const [createMenuOpen, setCreateMenOpen] = useState(false);

  const navigate = useNavigate();

  const goToPage = (pageId: string) => {
    if (!!characterId) {
      navigate(
        `rulesets/${rulesetId}/characters/${characterId}/${
          journal ? 'journal' : 'rulebook'
        }?page=${pageId}`,
      );
    } else {
      navigate(`rulesets/${rulesetId}/rulebook?page=${pageId}`);
    }
  };

  const { updatePage } = useUpdatePage();
  const { pages: rulebookPages, loading: pagesLoading } = usePages();

  const pages = journal ? journalPages : rulebookPages;
  const shouldRenderAddButton = !readOnly && (journal ? true : pages.length !== 0);

  const [collapsedPageIds, setCollapsedPageIds] = useState<string[]>([]);

  const pageTreeItems: PageTreeItem[] = pages.map((page) => ({
    id: page.id,
    label: page.title,
    sortIndex: page.sortIndex,
    parentId: page.parentId ?? null,
    children: [],
    leaf: true, // allows for deep nesting
    collapsed: collapsedPageIds.includes(page.id),
  }));

  const pageTree = buildPageTree(pageTreeItems);
  const filteredPageTree = filterTreeWithAncestorsByLabel(pageTree, filterValue);

  const [_, setPageTree] = useState<TreeItem[]>(pageTree);

  const handleCollapse = (id: string) => {
    if (collapsedPageIds.includes(id)) {
      setCollapsedPageIds((prev) => prev.filter((pageId) => pageId !== id));
    } else {
      setCollapsedPageIds((prev) => [...prev, id]);
    }
  };

  const handleRename = (title: string) => {
    if (!selectedPageId) return;
    const selectedPage = pages.find((page) => page.id === selectedPageId);
    if (!selectedPage) return;

    if (title === '' || title === selectedPage.title) return;

    updatePage({
      id: selectedPageId,
      title,
    });
  };

  const onDrop = async (id: string, parentId: string | null, sortedChildren: string[]) => {
    const sortIndex = sortedChildren.indexOf(id);
    updatePage({
      id,
      parentId,
      sortIndex,
    });
    return true;
  };

  return (
    <AnimatePresence>
      <Stack height='100%' width='100%' sx={{ maxWidth: 240 }}>
        {!hideHeader && (
          <>
            {shouldRenderAddButton && (
              <Tooltip title='New Page' placement='top'>
                <IconButton
                  sx={{ width: 50, ml: 1 }}
                  aria-label='New page'
                  variant='ghost'
                  onClick={() => setCreateMenOpen((prev) => !prev)}>
                  <PostAdd fontSize='small' />
                </IconButton>
              </Tooltip>
            )}
          </>
        )}

        <motion.div
          initial={{ height: 0, display: 'none', width: '100%', opacity: 0 }}
          animate={{
            height: createMenuOpen ? '100px' : '0px',
            display: createMenuOpen ? 'flex' : 'none',
            opacity: createMenuOpen ? 1 : 0,
          }}>
          <Stack padding={2}>
            <CreatePageButtons
              selectedPageId={selectedPageId}
              onCreate={() => setCreateMenOpen(false)}
            />
          </Stack>
        </motion.div>

        <Stack sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: 500 }} padding={2} pt={0}>
          {pagesLoading ? (
            <PageTreeLoading />
          ) : pages.length === 0 && !readOnly && !characterId ? (
            <CreatePageButtons selectedPageId={selectedPageId} />
          ) : (
            <SortableTree
              readOnly={readOnly || (!!characterId && !journal)}
              indentationWidth={20}
              items={filteredPageTree}
              setItems={setPageTree}
              selectedId={selectedPageId}
              onSelect={goToPage}
              onDrop={onDrop}
              onUpdateName={handleRename}
              onCollapse={handleCollapse}
              selectedStyle={{ h6: { color: 'secondary.main' } }}
            />
          )}
        </Stack>
      </Stack>
    </AnimatePresence>
  );
};
