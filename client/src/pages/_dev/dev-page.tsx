import { SheetType, useCreateSheet, useCurrentUser } from '@/libs/compass-api';
import { Stack } from '@/libs/compass-core-ui';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const fakeRulesetId = '241ccd11-9185-4166-b2d3-dbcbea554d52';

export const DevPage = () => {
  const [sheetId, setSheetId] = useState<string | null>(null);
  const { createSheetCacheOnly } = useCreateSheet();
  const { currentUser } = useCurrentUser();

  const { rulesetId } = useParams();

  useEffect(() => {
    if (currentUser && !sheetId && rulesetId) {
      const tabId = currentUser.id;

      const sheet = createSheetCacheOnly({
        id: currentUser.id,
        title: 'INVENTORY',
        templateType: null,
        type: SheetType.SHEET,
        userId: currentUser.id,
        version: 1,
        description: '',
        pageId: '',
        tabs: JSON.stringify([{ title: 'user-inventory', position: 0, tabId }]),
        username: '',
        components: [],
        templateId: null,
        rulesetId: fakeRulesetId,
        rulesetTitle: null,
        backgroundImage: null,
        templateName: null,
        image: null,
        details: JSON.stringify({
          defaultFont: 'Roboto Condensed',
          colors: [],
          snapToGrid: true,
          enableLogic: false,
          renderGrid: 'square',
        }),
      });
      setSheetId(sheet.id);
    }
  }, [currentUser, rulesetId]);

  if (!sheetId) {
    return null;
  }

  return <Stack sx={{ width: '100vw' }} alignItems='center' justifyContent='start'></Stack>;
};
