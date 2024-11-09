import { Sheet, useSheetTemplates } from '@/libs/compass-api';
import { Input, Loader, Stack, Text, useDeviceSize } from '@/libs/compass-core-ui';
import { useState } from 'react';
import { EntityCardSlider } from '../entity-card';

interface Props {
  rulesetId: string;
  selectedId?: string;
  onSelect: (template: Sheet) => void;
  templates?: Sheet[];
}

export const SelectSheetTemplate = ({ rulesetId, onSelect, selectedId, templates }: Props) => {
  const { sheets: fetchedSheets, loading } = useSheetTemplates(rulesetId, !!templates);
  const { mobile } = useDeviceSize();

  const sheets = templates || fetchedSheets;

  const [filter, setFilter] = useState<string>('');

  const filteredSheets = sheets.filter((sheet) =>
    sheet.title.toLowerCase().includes(filter.toLowerCase()),
  );

  const handleSelect = (entity: any) => {
    const selectedTemplate = sheets.find((sheet) => sheet.id === entity.id);
    if (!selectedTemplate) return;
    onSelect(selectedTemplate);
  };

  return (
    <Stack padding={mobile ? 0 : 2} pt={mobile ? 2 : 0}>
      {loading ? (
        <Loader color='info' />
      ) : (
        <>
          <Input
            id='template-select-filter'
            sx={{ width: 200 }}
            placeholder='Filter by name'
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />

          <EntityCardSlider
            selectedId={selectedId}
            entities={filteredSheets}
            emptyState={<Text fontStyle='italic'>No templates found</Text>}
            onClick={handleSelect}
          />
        </>
      )}
    </Stack>
  );
};
