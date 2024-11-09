import { Sheet } from '@/libs/compass-api';
import { Modal, Stack, Text, useDeviceSize } from '@/libs/compass-core-ui';
import { ReactNode, useState } from 'react';
import { SheetCardSlider } from './sheet-card-slider';

interface SheetCardSelectProps {
  sheets: Sheet[];
  filterOptions?: ReactNode;
  loading?: boolean;
  emptyState?: ReactNode;
  selectedId?: string;
  onSelect: (sheet: Sheet) => void;
}

export const SheetCardSelect = ({
  sheets,
  filterOptions,
  loading,
  emptyState,
  selectedId,
  onSelect,
}: SheetCardSelectProps) => {
  const { mobile } = useDeviceSize();

  return (
    <Stack
      sx={{
        maxHeight: mobile ? '300px' : '500px',
        overflow: 'hidden',
        width: '100%',
      }}
      alignItems='center'
      spacing={2}>
      {!!filterOptions && filterOptions}
      <SheetCardSlider
        selectedId={selectedId}
        style={{
          height: '300px',
          paddingTop: '8px',
          paddingBottom: mobile ? '100px' : '8pxpx',
        }}
        onClick={(sheet) => onSelect(sheet)}
        direction='vertical'
        sheets={sheets}
        emptyState={emptyState ?? <Text>No templates found</Text>}
        loading={loading}
      />
    </Stack>
  );
};

interface SheetCardSelectModalProps {
  open: boolean;
  title?: string;
  filterOptions?: ReactNode;
  onClose: () => void;
  sheets: Sheet[];
  loading?: boolean;
  onSelect: (sheet: Sheet) => void;
  emptyState?: ReactNode;
}

export const SheetCardSelectModal = ({
  open,
  onClose,
  filterOptions,
  title,
  loading,
  sheets,
  onSelect,
  emptyState,
}: SheetCardSelectModalProps) => {
  const [selected, setSelected] = useState<Sheet | null>(null);

  const handleSelect = () => {
    if (!selected) return;
    onSelect(selected);
  };

  return (
    <Modal
      title={title}
      open={open}
      onClose={onClose}
      loading={loading}
      actions={[
        {
          label: 'Select',
          isPrimary: true,
          onClick: handleSelect,
          disabled: !selected,
        },
      ]}>
      <SheetCardSelect
        sheets={sheets}
        filterOptions={filterOptions}
        selectedId={selected?.id}
        onSelect={setSelected}
        loading={loading}
        emptyState={emptyState}
      />
    </Modal>
  );
};
