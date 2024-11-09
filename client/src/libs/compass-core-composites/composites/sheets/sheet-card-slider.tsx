import { Sheet, SheetType } from '@/libs/compass-api';
import { Skeleton, Stack, Tab, Tabs, Text, useDeviceSize } from '@/libs/compass-core-ui';
import { CSSProperties, ReactNode, useState } from 'react';
import { SheetCard } from './sheet-card';

interface SheetCardSliderProps {
  sheets: Sheet[];
  title?: string;
  onClick?: (sheet: Sheet) => void;
  actions?: ReactNode;
  emptyState: ReactNode;
  direction: 'horizontal' | 'vertical';
  selectedId?: string;
  style?: CSSProperties;
  animate?: boolean;
  loading?: boolean;
  showFilters?: boolean;
}

export const SheetCardSlider = ({
  onClick,
  sheets,
  actions,
  title,
  emptyState,
  direction,
  selectedId,
  style,
  animate = true,
  loading = false,
  showFilters = false,
}: SheetCardSliderProps) => {
  const { tablet, desktop, mobile } = useDeviceSize();

  const [appliedFilter, setAppliedFilter] = useState<SheetType>(SheetType.SHEET);

  const filteredSheets = !showFilters ? sheets : sheets.filter((s) => s.type === appliedFilter);

  const defaultStyle: CSSProperties =
    direction === 'vertical'
      ? {
          minHeight: 220,
          maxWidth: mobile ? '100vw' : 680,
          maxHeight: tablet ? '70vh' : desktop ? '80vh' : '35vh',
          flexWrap: 'wrap',
          overflowY: 'auto',
          padding: 3,
          paddingTop: 0,
        }
      : {
          minHeight: 220,
          maxWidth: '100vw',
          flexWrap: 'wrap',
          overflowY: 'auto',
          padding: 3,
          paddingTop: 0,
        };

  return (
    <Stack spacing={4} sx={{ height: '80vh' }}>
      {(!!title || !!actions || showFilters) && (
        <Stack spacing={2} pl={3}>
          <Text variant='h4'>{title}</Text>
          {actions}
          {showFilters && (
            <Tabs value={appliedFilter} onChange={(_, val) => setAppliedFilter(val)}>
              <Tab label='Sheets' value={SheetType.SHEET} />
              <Tab label='Templates' value={SheetType.TEMPLATE} />
            </Tabs>
          )}
        </Stack>
      )}

      <Stack
        direction='row'
        gap={3}
        justifyContent={desktop ? 'flex-start' : 'center'}
        sx={{ ...defaultStyle, ...style }}>
        {loading ? (
          <Skeleton
            variant='rectangular'
            sx={{ height: '210px', width: mobile ? '220px' : '280px' }}
          />
        ) : filteredSheets.length === 0 ? (
          emptyState
        ) : (
          filteredSheets.map((sheet) => (
            <SheetCard
              animate={desktop && animate}
              key={sheet.id}
              sheet={sheet}
              onClick={() => onClick?.(sheet)}
              selected={selectedId === sheet.id}
            />
          ))
        )}
      </Stack>
    </Stack>
  );
};
