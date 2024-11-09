import { Chart } from '@/libs/compass-api';
import { ChartLookup } from '@/libs/compass-core-composites';
import { generateId } from '@/libs/compass-web-utils';
import { Button, Select, Stack, Text } from '@chakra-ui/react';
import { useMemo, useState } from 'react';

interface SetAttributeRestraintsProps {
  onClose: () => void;
  onAddRestraints: (restraints: string[]) => void;
}

export const SetAttributeRestraints = ({
  onClose,
  onAddRestraints,
}: SetAttributeRestraintsProps) => {
  const [restraintChart, setRestraintChart] = useState<Chart | null>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<string>();
  const data: string[][] = restraintChart?.data ?? [];

  const columnNames = data.length ? data[0] : [];

  const columns = useMemo(
    () =>
      columnNames.map((cn) => ({
        name: cn,
        id: generateId(),
      })),
    [restraintChart],
  );

  const handleAdd = () => {
    if (!selectedColumnId) return;
    const index = columns.map((c) => c.id).indexOf(selectedColumnId);
    if (index === -1) return;
    const restraints = new Set<string>();
    for (const row of data.slice(1)) {
      restraints.add(row[index]);
    }
    onAddRestraints([...restraints]);
    setSelectedColumnId(undefined);
    setRestraintChart(null);
    onClose();
  };

  return (
    <Stack spacing={4}>
      <Text onClick={onClose} role='button' width='100px'>
        Cancel
      </Text>
      <ChartLookup onSelect={setRestraintChart} chartId={restraintChart?.id} />

      <Stack>
        <Text>Select Column</Text>
        <Select
          onChange={(e) => setSelectedColumnId(e.target.value as string)}
          value={selectedColumnId}
          disabled={!restraintChart}>
          {columns.map((c, i) => (
            <option key={i} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </Stack>

      <Button isDisabled={!selectedColumnId} onClick={handleAdd} width='200px'>
        Add from Chart
      </Button>
    </Stack>
  );
};
