import { Page, useCharacter, usePages } from '@/libs/compass-api';
import { AutoComplete, AutoCompleteOption, Input } from '@/libs/compass-core-ui';
import React from 'react';
import { useParams } from 'react-router-dom';

const URL_REGEX = /^(https?:\/\/[A-Za-z0-9.-]+\.[A-Za-z]{2,}(?:\/[^/]+)*)$/;

interface PageLookupProps {
  onSelect?: (page: Page | null) => void;
  onEnterUrl?: (url: string) => void;
  pageId?: string;
  defaultUrl?: string;
  label?: string;
  style?: React.CSSProperties;
}

export const PageLookup = ({
  onSelect,
  onEnterUrl,
  pageId,
  defaultUrl,
  label,
  style,
}: PageLookupProps) => {
  const { characterId } = useParams();
  const { pages: rulebookPages, loading: pagesLoading } = usePages();
  const { character, loading: characterLoading } = useCharacter(characterId);
  const [error, setError] = React.useState<string | null>(null);

  const loading = pagesLoading || characterLoading;

  const pages = !!characterId
    ? [...rulebookPages, ...(character?.pages ?? [])]
    : rulebookPages ?? [];

  const options = pages.map((page) => ({
    label: page.title,
    value: page.id,
  }));

  const selectedOption = options.find((opt) => opt.value === pageId) ?? null;

  const handleSelect = (option: AutoCompleteOption | null) => {
    const selection = option as AutoCompleteOption;
    const selectedPage = option ? pages.find((page) => page.id === selection.value) : null;
    onSelect?.(selectedPage ?? null);
  };

  const inputProps = {
    id: 'page-select',
    label,
    placeholder: 'Enter a page title or URL',
    helperText: error,
    error: !!error,
  };

  return (
    <AutoComplete
      sx={{ width: 250, ...style }}
      freeSolo
      disablePortal
      loading={loading}
      options={options}
      value={selectedOption ?? defaultUrl}
      isOptionEqualToValue={(option, value) => {
        if (typeof option === 'string' || typeof value === 'string') {
          return option === value;
        } else {
          return option.value === value.value;
        }
      }}
      noOptionsText='No Pages Found'
      onChange={(_, option) => {
        if (typeof option === 'string') {
          if (URL_REGEX.test(option)) {
            setError('');
            onEnterUrl?.(option);
          } else {
            setError('Invalid URL');
          }
        } else {
          handleSelect(option);
          setError('');
        }
      }}
      renderInput={(params) => <Input {...params} {...inputProps} />}
    />
  );
};
