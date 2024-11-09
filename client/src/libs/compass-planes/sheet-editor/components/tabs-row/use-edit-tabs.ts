import {
  Sheet,
  SheetTab,
  useComponents,
  useCreateComponent,
  useUpdateSheet,
} from '@/libs/compass-api';
import { useEditorStore } from '@/libs/compass-planes/common/editor-store';
import { useNavigateTabs } from '@/libs/compass-planes/common/hooks/use-navigate-tabs';
import { generateId } from '@/libs/compass-web-utils';

interface UseEditTabsProps {
  sheet?: Sheet;
}

export type UpdateTabProps = {
  id: string;
  title?: string;
  conditionalRenderAttributeId?: string | null;
  conditionalRenderInverse?: boolean;
};

export const useEditTabs = ({ sheet }: UseEditTabsProps) => {
  const { sheetId, cacheOnly } = useEditorStore();
  const tabs: SheetTab[] = sheet?.tabs ? JSON.parse(sheet.tabs) : [];

  const { setActiveTab } = useNavigateTabs(tabs);

  const { updateSheet, loading } = useUpdateSheet(cacheOnly);
  const { components } = useComponents(sheet?.id);
  const { createComponents } = useCreateComponent();

  const updateTab = ({
    title,
    id,
    conditionalRenderAttributeId,
    conditionalRenderInverse,
  }: UpdateTabProps) => {
    if (!sheet) return;
    updateSheet({
      input: {
        id: sheetId,
        tabs: JSON.stringify(
          tabs.map((tab) => {
            if (tab.tabId !== id) return tab;
            return {
              ...tab,
              title: title ?? tab.title,
              conditionalRenderAttributeId:
                conditionalRenderAttributeId === undefined
                  ? tab.conditionalRenderAttributeId
                  : conditionalRenderAttributeId,
              conditionalRenderInverse: conditionalRenderInverse ?? tab.conditionalRenderInverse,
            };
          }),
        ),
      },
    });
  };

  const addTab = async (label?: string, duplicateFromTabId?: string) => {
    if (!sheet) return;

    const updatedTabs = tabs.map((tab, index) => ({
      ...tab,
      position: index,
    }));

    const tabToDuplicate = tabs.find((t) => t.tabId === duplicateFromTabId);

    const tab = {
      tabId: generateId(),
      title: label ?? 'New Page',
      position: sheet.tabs.length,
      ...(tabToDuplicate && {
        conditionalRenderAttributeId: tabToDuplicate.conditionalRenderAttributeId,
        conditionalRenderInverse: tabToDuplicate.conditionalRenderInverse,
      }),
    };

    await updateSheet({
      input: {
        id: sheetId,
        tabs: JSON.stringify([...updatedTabs, tab]),
      },
    });

    return tab;
  };

  const removeTab = async (tabId: string) => {
    if (!sheet) return;

    if (tabs.length === 1) return;

    const index = tabs.map((t) => t.tabId).indexOf(tabId);

    const updatedTabs = tabs
      .filter((tab) => tab.tabId !== tabId)
      .map((tab, index) => ({
        ...tab,
        position: index,
      }));

    setActiveTab(index === 0 ? tabs[1].tabId : tabs[Math.max(0, index - 1)].tabId);

    await updateSheet({
      input: {
        id: sheetId,
        tabs: JSON.stringify(updatedTabs),
      },
    });

    return 'success';
  };

  const duplicateTab = async (tabId: string) => {
    const tab = tabs.find((t) => t.tabId === tabId);
    const tabComponents = components.filter((c) => c.tabId === tabId);
    const newTab = await addTab(tab?.title ? `${tab.title} Copy` : 'New Tab', tabId);
    await createComponents({
      components: tabComponents.map((c) => ({
        ...c,
        tabId: newTab?.tabId ?? c.tabId,
      })),
    });
  };

  return {
    updateTab,
    addTab,
    removeTab,
    duplicateTab,
    loading,
  };
};
