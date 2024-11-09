import { SheetTab } from '@/libs/compass-api';
import { useSearchParams } from 'react-router-dom';

export const useNavigateTabs = (tabs: SheetTab[]) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const directTabId = searchParams.get('tab');

  const sortedTabs = [...tabs].sort((a, b) => a.position - b.position);

  const directTabFound = tabs.find((t) => t.tabId === directTabId);

  const defaultTabId =
    directTabId && directTabFound ? directTabId : sortedTabs.length > 0 ? sortedTabs[0].tabId : '';

  const activeTab = defaultTabId;

  const setActiveTab = (id: string) => {
    searchParams.set('tab', id);
    setSearchParams(searchParams);
  };

  return {
    activeTab,
    setActiveTab,
  };
};
