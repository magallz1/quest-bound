import { IconButton, Stack, Text, useDeviceSize } from '@/libs/compass-core-ui';
import { DensityLarge, DensityMedium, HorizontalRule, ImportExport } from '@mui/icons-material';
import React from 'react';

interface Props {
  onSortChange: (value: 'Alphabetical' | 'Type') => void;
  onColumnsChange: React.Dispatch<React.SetStateAction<number>>;
  sortValue: 'Alphabetical' | 'Type';
  columns: number;
}

export const AttributeSort = ({ columns, sortValue, onSortChange, onColumnsChange }: Props) => {
  const { mobile } = useDeviceSize();

  const handleSort = () => {
    switch (sortValue) {
      case 'Alphabetical':
        onSortChange('Type');
        break;
      case 'Type':
        onSortChange('Alphabetical');
        break;
    }
  };

  return (
    <Stack direction={mobile ? 'column' : 'row'} spacing={mobile ? 0 : 1}>
      <IconButton onClick={handleSort}>
        <Stack direction='row' spacing={1}>
          <Text fontSize='0.9rem'>{sortValue}</Text>
          <ImportExport fontSize='small' />
        </Stack>
      </IconButton>
      {!mobile && (
        <IconButton
          onClick={() =>
            onColumnsChange((prev) => {
              if (prev === 3 || (mobile && prev === 2)) return 1;
              return prev + 1;
            })
          }>
          {columns === 3 ? (
            <DensityMedium fontSize='small' sx={{ transform: 'rotate(90deg)' }} />
          ) : columns === 2 ? (
            <DensityLarge fontSize='small' sx={{ transform: 'rotate(90deg)' }} />
          ) : (
            <HorizontalRule fontSize='small' sx={{ transform: 'rotate(90deg)' }} />
          )}
        </IconButton>
      )}
    </Stack>
  );
};
