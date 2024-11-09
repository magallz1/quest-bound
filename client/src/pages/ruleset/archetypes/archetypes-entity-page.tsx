import { useQuickCreate } from '@/hooks';
import { Grid } from '@/libs/compass-core-composites';
import { Button, Input, Modal, ModalContent, ModalOverlay, Stack } from '@chakra-ui/react';
import { Add } from '@mui/icons-material';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArchetypeForm } from '../components/quick-create/quick-archetype';
import { useArchetypeChart } from './use-archetype-chart';

export const ArchetypesEntityPage = () => {
  const { setQuickCreatePage } = useQuickCreate();

  const [searchParams, setSearchParams] = useSearchParams();
  const filterValue = searchParams.get('filter') ?? '';
  const [columnFilter, setColumnFilter] = useState<string>('');

  const { columns, rows, updateCell, selectedArchetype, clearSelection } = useArchetypeChart();

  const filteredRows = rows.filter((row) => row._id.includes(filterValue.toLowerCase()));
  const filteredColumns = useMemo(
    () =>
      columns.filter(
        (column: any) =>
          column.headerName.toLowerCase().includes(columnFilter.toLowerCase()) ||
          column.field === 'property' ||
          column.headerClass?.toLowerCase().includes(columnFilter.toLowerCase()),
      ),
    [columnFilter, columns],
  );

  const setFilterValue = (value: string) => {
    if (!value) {
      searchParams.delete('filter');
      setSearchParams(searchParams);
      return;
    }
    searchParams.set('filter', value);
    setSearchParams(searchParams);
  };

  return (
    <>
      <Stack
        spacing={4}
        sx={{
          flexGrow: 1,
        }}>
        <Stack direction='row' spacing={2} alignItems='center'>
          <Button
            onClick={() => setQuickCreatePage('archetype')}
            rightIcon={<Add fontSize='small' />}>
            Create Archetype
          </Button>
          <Input
            maxWidth={250}
            placeholder='Filter by attribute'
            onChange={(e) => setFilterValue(e.target.value)}
            value={filterValue}
          />
          <Input
            maxWidth={250}
            placeholder='Filter by archetype or category'
            onChange={(e) => setColumnFilter(e.target.value)}
            value={columnFilter}
          />
        </Stack>
        <Grid
          colDefs={filteredColumns}
          rowData={filteredRows}
          onCellValueChanged={(data: any, colId) => {
            updateCell(
              colId,
              data._attributeId ?? data._id,
              data[colId as keyof typeof data] ?? '',
            );
          }}
        />
      </Stack>

      <Modal isOpen={!!selectedArchetype} onClose={clearSelection} isCentered size='xl'>
        <ModalOverlay />
        <ModalContent>
          <Stack padding={4}>
            <ArchetypeForm archetypeId={selectedArchetype?.id} />
          </Stack>
        </ModalContent>
      </Modal>
    </>
  );
};
