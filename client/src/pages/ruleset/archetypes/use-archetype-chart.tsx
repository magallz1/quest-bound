import {
  useArchetypes,
  useAttributes,
  useChart,
  useUpdateArchetype,
  useUpdateChart,
} from '@/libs/compass-api';
import { Image, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';

export const useArchetypeChart = () => {
  const { archetypes } = useArchetypes();
  const { updateArchetype } = useUpdateArchetype();

  const { attributes } = useAttributes();

  const { chart } = useChart('archetypes');
  const { updateChart } = useUpdateChart();

  const [selectedArchetypeId, setSelectedArchetypeId] = useState<string>('');
  const selectedArchetype = archetypes.find((archetype) => archetype.id === selectedArchetypeId);

  const clearSelection = () => setSelectedArchetypeId('');

  const rawChartData = chart?.data ?? [['[]']];

  const chartData = JSON.parse(rawChartData[0][0] ?? '[]') as {
    id: string;
    value: Record<string, string>;
  }[];

  const archetypeOverrideMap = new Map<string, Record<string, string>>();

  for (const datum of chartData) {
    const { id, value } = datum;
    archetypeOverrideMap.set(id, value);
  }

  const sortedArchetypes = [...archetypes].sort((a, b) => a.title.localeCompare(b.title));
  const sortedAttributes = [...attributes].sort((a, b) => a.name.localeCompare(b.name));

  const columns: any = [
    {
      field: 'property',
      headerName: 'Property',
      editable: false,
      headerClass: '',
      sortable: false,
    },
  ];

  const categoryRow = {
    _id: '_category',
    property: 'Category',
  };

  for (const archetype of sortedArchetypes) {
    columns.push({
      field: archetype.id,
      headerName: archetype.title,
      headerClass: archetype.category ?? '',
      editable: true,
      sortable: false,
      headerComponent: () => (
        <Stack
          direction='row'
          spacing={8}
          align='center'
          role='button'
          padding={1}
          onClick={() => setSelectedArchetypeId(archetype.id)}>
          <Text fontSize='1.1rem'>{archetype.title}</Text>
          {archetype.image && (
            <Image sx={{ height: '60px' }} src={archetype.image.src ?? ''} alt={archetype.title} />
          )}
        </Stack>
      ),
    });

    categoryRow[archetype.id as keyof typeof categoryRow] = archetype.category ?? '';
  }

  const rows = [categoryRow];

  for (const attribute of sortedAttributes) {
    const row = {
      _id: attribute.name.toLowerCase(),
      _attributeId: attribute.id,
      property: attribute.name,
    };

    for (const archetype of sortedArchetypes) {
      const archetypeOverride = archetypeOverrideMap.get(archetype.id);
      const attributeOverrideValue = archetypeOverride?.[attribute.id];
      row[archetype.id as keyof typeof row] = attributeOverrideValue ?? attribute.defaultValue;
    }
    rows.push(row);
  }

  const updateCell = (archetypeId: string, attributeId: string, value: string) => {
    if (attributeId === '_category') {
      updateArchetype({
        id: archetypeId,
        category: value,
      });
      return;
    }

    const existingOverrides = archetypeOverrideMap.get(archetypeId) ?? {};

    archetypeOverrideMap.set(archetypeId, {
      ...existingOverrides,
      [attributeId]: value,
    });

    const updatedChartData = [];

    for (const [id, value] of archetypeOverrideMap) {
      updatedChartData.push({
        id,
        value,
      });
    }

    updateChart(
      {
        id: 'archetypes',
      },
      [[JSON.stringify(updatedChartData)]],
    );
  };

  return {
    columns,
    rows,
    updateCell,
    selectedArchetype,
    clearSelection,
  };
};
