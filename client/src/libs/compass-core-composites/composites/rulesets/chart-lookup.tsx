import { Chart, useCharts } from '@/libs/compass-api';
import { AutoCompleteOption } from '@/libs/compass-core-ui';
import { CircularProgress, Input, Stack, Text } from '@chakra-ui/react';
import React, { useState } from 'react';

interface ChartLookupProps {
  rulesetId?: string;
  onSelect: (chart: Chart | null) => void;
  chartId?: string;
  className?: string;
  label?: string;
  style?: React.CSSProperties;
}

export const ChartLookup = ({
  rulesetId,
  onSelect,
  chartId,
  label,
  style,
  className,
}: ChartLookupProps) => {
  const { charts, loading } = useCharts(rulesetId);

  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  const chartOptions = charts.map((chart) => ({
    label: chart.title,
    value: chart.id,
  }));

  const filteredOptions = chartOptions.filter((option) =>
    option.label.toLowerCase().includes(value.toLowerCase()),
  );

  const selectedChart = charts.find((chart) => chart.id === chartId);

  const handleSelect = (option: AutoCompleteOption | null) => {
    const selectedChart = option ? charts.find((chart) => chart.id === option.value) : null;
    onSelect(selectedChart ?? null);
    setFocused(false);
  };

  return (
    <section style={{ width: '250px' }}>
      <Input
        value={selectedChart?.title ?? value}
        placeholder='Search charts'
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          if (!hovered) {
            setFocused(false);
          }
        }}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (!chartId) return;
          if (e.key === 'Escape' || e.key === 'Backspace') {
            setFocused(false);
            onSelect(null);
            setValue('');
          }
        }}
      />

      {focused && (
        <Stack
          style={{ position: 'absolute', width: '250px', zIndex: 1000 }}
          bg='gray.600'
          padding={2}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}>
          {loading && <CircularProgress isIndeterminate />}
          {filteredOptions.map((chart) => (
            <Text
              role='button'
              key={chart.value}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(chart);
              }}>
              {chart.label}
            </Text>
          ))}
          {!filteredOptions.length && !loading && <Text>No charts found</Text>}
        </Stack>
      )}
    </section>
  );
};
