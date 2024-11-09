import { Archetype, useArchetypes } from '@/libs/compass-api';
import { AutoComplete, AutoCompleteOption, Input } from '@/libs/compass-core-ui';
import React from 'react';

interface ArchetypeLookupProps {
  onSelect?: (archetype: Archetype | null) => void;
  archetypeId?: string;
  label?: string;
  style?: React.CSSProperties;
  loading?: boolean;
  filterIds?: string[];
}

export const ArchetypeLookup = ({
  onSelect,
  archetypeId,
  label,
  style,
  loading: externalLoading,
  filterIds = [],
}: ArchetypeLookupProps) => {
  const { archetypes, loading: archetypesLoading } = useArchetypes();

  const loading = externalLoading || archetypesLoading;

  const options = archetypes
    .map((arch) => ({
      label: arch.title,
      value: arch.id,
    }))
    .filter((arch) => !filterIds.includes(arch.value));

  const selectedOption = options.find((opt) => opt.value === archetypeId) ?? null;

  const handleSelect = (option: AutoCompleteOption | AutoCompleteOption[] | null) => {
    const selection = option as AutoCompleteOption;
    const selectedAttribute = option
      ? archetypes.find((arch) => arch.id === selection.value)
      : null;
    onSelect?.(selectedAttribute ?? null);
  };

  const inputProps = {
    id: 'archetype-select',
    label,
    ignoreHelperText: true,
    placeholder: 'Search by archetype',
  };

  return (
    <AutoComplete
      sx={{ width: 250, ...style }}
      loading={loading}
      disablePortal
      options={options}
      value={selectedOption}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      noOptionsText='No Archetypes Found'
      limitTags={3}
      onChange={(_, option) => handleSelect(option)}
      renderInput={(params) => <Input {...params} {...inputProps} />}
    />
  );
};
