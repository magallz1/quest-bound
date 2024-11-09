import { AttributeContext, Sheet, SheetTab, useUpdateSheet } from '@/libs/compass-api';
import { IconButton, Paper, Skeleton, Stack } from '@/libs/compass-core-ui';
import { useEditorStore } from '@/libs/compass-planes/common/editor-store';
import { useNavigateTabs } from '@/libs/compass-planes/common/hooks/use-navigate-tabs';
import { Add } from '@mui/icons-material';
import { Reorder } from 'framer-motion';
import { CSSProperties, useContext, useEffect, useState } from 'react';
import { TabItem } from './tab-item';
import { useEditTabs } from './use-edit-tabs';

interface TabsRowProps {
  sheet?: Sheet;
  viewMode: boolean;
  style?: CSSProperties;
  loading?: boolean;
}

export const TabsRow = ({ sheet, style, loading }: TabsRowProps) => {
  const { cacheOnly, viewMode } = useEditorStore();
  const tabs = sheet?.tabs ? JSON.parse(sheet.tabs) : [];
  const { activeTab, setActiveTab } = useNavigateTabs(tabs);

  const { updateSheet } = useUpdateSheet(cacheOnly);

  const { attributes } = useContext(AttributeContext);

  const [orderedTabs, setOrderedTabs] = useState<SheetTab[]>(
    [...tabs].sort((a, b) => a.position - b.position),
  );

  const filteredTabs = orderedTabs.filter((tab) => {
    if (!viewMode) return true;
    const { conditionalRenderAttributeId } = tab;
    if (!conditionalRenderAttributeId) return true;
    const attribute = attributes.find((a) => a.id === conditionalRenderAttributeId);
    if (!attribute) return true;
    if (tab.conditionalRenderInverse) return attribute.value !== 'true';
    return attribute.value === 'true';
  });

  // When a conditionally rendered active tab is filtered out
  useEffect(() => {
    const thisTab = filteredTabs.find((tab) => tab.tabId === activeTab);
    if (!thisTab) {
      setActiveTab(filteredTabs[0]?.tabId);
    }
  }, [JSON.stringify(filteredTabs)]);

  useEffect(() => {
    if (!sheet) return;
    setOrderedTabs([...tabs].sort((a, b) => a.position - b.position));
  }, [JSON.stringify(tabs)]);

  const updateOrder = () => {
    if (!sheet) return;
    let orderChanged = false;
    orderedTabs.forEach((tab, index) => {
      if (tab.position !== index) orderChanged = true;
    });

    if (!orderChanged) return;

    updateSheet({
      input: {
        id: sheet.id,
        tabs: JSON.stringify(
          orderedTabs.map((tab, index) => ({
            ...tab,
            position: index,
          })),
        ),
      },
    });
  };

  const {
    updateTab,
    removeTab,
    addTab,
    duplicateTab,
    loading: tabsLoading,
  } = useEditTabs({
    sheet,
  });

  const handleCreate = () => {
    addTab(`Page ${tabs.length + 1}`);
  };

  return (
    <>
      <Paper sx={{ width: '90dvw', ...style }}>
        <Stack
          direction='row'
          sx={{
            width: '100%',
            height: 40,
            gridRow: 2,
            pl: 2,
            pr: 2,
            maxWidth: '100vw',
            overflowY: 'hidden',
            overflowX: 'auto',
          }}
          spacing={viewMode ? 2 : 0}>
          {!viewMode && (
            <IconButton
              size='small'
              disabled={tabsLoading || loading}
              onClick={handleCreate}
              title='Add Page'
              sx={{ mr: 3 }}>
              <Add fontSize='small' />
            </IconButton>
          )}

          {loading ? (
            <Stack direction='row' alignItems='center'>
              <Skeleton height={20} width={100} variant='rectangular' sx={{ mr: 2 }} />
              <Skeleton height={20} width={100} variant='rectangular' sx={{ mr: 2 }} />
              <Skeleton height={20} width={100} variant='rectangular' sx={{ mr: 2 }} />
            </Stack>
          ) : viewMode ? (
            filteredTabs.map((tab) => (
              <TabItem
                readOnly={viewMode}
                key={tab.tabId}
                tab={tab}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                removeTab={removeTab}
                duplicateTab={duplicateTab}
              />
            ))
          ) : (
            <Reorder.Group
              as='div'
              axis='x'
              values={orderedTabs}
              onReorder={setOrderedTabs}
              style={{ display: 'flex' }}>
              {orderedTabs.map((tab) => (
                <Reorder.Item as='div' key={tab.tabId} value={tab} style={{ height: '100%' }}>
                  <TabItem
                    key={tab.tabId}
                    tab={tab}
                    disableDelete={orderedTabs.length === 1}
                    readOnly={viewMode}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    duplicateTab={duplicateTab}
                    onRelease={updateOrder}
                    updateTab={updateTab}
                    removeTab={removeTab}
                  />
                </Reorder.Item>
              ))}
            </Reorder.Group>
          )}
        </Stack>
      </Paper>
    </>
  );
};
