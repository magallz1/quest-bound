import { Document, useDocuments } from '@/libs/compass-api';
import { AutoComplete, AutoCompleteOption, Input } from '@/libs/compass-core-ui';
import React from 'react';

interface DocumentLookupProps {
  onSelect: (document: Document | null) => void;
  documentId?: string;
  label?: string;
  style?: React.CSSProperties;
}

export const DocumentLookup = ({ onSelect, documentId, label, style }: DocumentLookupProps) => {
  const { documents, loading } = useDocuments();

  const options = documents.map((doc) => ({
    label: doc.title,
    value: doc.id,
  }));

  const selectedOption = options.find((opt) => opt.value === documentId) ?? undefined;

  const handleSelect = (option: AutoCompleteOption | null) => {
    const selected = option ? documents.find((doc) => doc.id === option.value) : null;
    onSelect(selected ?? null);
  };

  const inputProps = {
    id: 'document-select',
    label,
    ignoreHelperText: true,
    placeholder: 'Search by document title',
  };

  return (
    <AutoComplete
      sx={{ width: 250, ...style }}
      loading={loading}
      disablePortal
      options={options}
      value={selectedOption}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      noOptionsText='No Documents Found'
      onChange={(_, option) => handleSelect(option)}
      renderInput={(params) => <Input {...params} {...inputProps} />}
    />
  );
};
