import MUIAutoComplete, { AutocompleteRenderOptionState } from '@mui/material/Autocomplete';
import { FilterOptionsState } from '@mui/material/useAutocomplete';
import { ReactNode } from 'react';
import { BaseProps } from '../../utils/base-props';
import { Input, InputProps } from '../input';

export type AutoCompleteOption = {
  label: string;
  value: string | number;
  [additional: string | number | symbol]: string | number;
};

export interface AutoCompleteProps extends BaseProps {
  options: AutoCompleteOption[];

  value?: AutoCompleteOption;

  inputValue?: string;

  multiple?: boolean;

  onInputChange?: (val: string, reason: 'input' | 'reset' | 'clear') => void;

  onSelect?: (val: AutoCompleteOption | null | string) => void;

  loadingText?: string;

  noOptionsText?: string;

  loading?: boolean;

  disabled?: boolean;

  inputProps?: InputProps;

  filterOptions?: (
    options: AutoCompleteOption[],
    state: FilterOptionsState<AutoCompleteOption>,
  ) => AutoCompleteOption[];

  renderOption?: (
    props: any,
    option: AutoCompleteOption,
    state: AutocompleteRenderOptionState,
  ) => ReactNode;

  getOptionLabel?: (option: AutoCompleteOption | string) => string;

  getOptionsDisabled?: (option: AutoCompleteOption) => boolean;
}

export const AutoComplete = ({
  options,
  value,
  inputValue,
  multiple = false,
  onInputChange,
  onSelect,
  loadingText = 'Loading',
  noOptionsText = 'No options',
  loading = false,
  disabled = false,
  inputProps,
  filterOptions,
  renderOption,
  getOptionLabel,
  getOptionsDisabled,
  ...props
}: AutoCompleteProps) => {
  return (
    <MUIAutoComplete
      value={value}
      multiple={multiple}
      noOptionsText={noOptionsText}
      inputValue={inputValue}
      clearOnBlur
      clearOnEscape
      onInputChange={(_, value, reason) => onInputChange?.(value, reason)}
      autoComplete
      options={options}
      getOptionDisabled={getOptionsDisabled}
      getOptionLabel={getOptionLabel}
      filterOptions={filterOptions}
      renderOption={renderOption}
      disabled={disabled}
      size='small'
      freeSolo
      loading={loading}
      loadingText={loadingText}
      // onChange={(_, value) => onSelect?.(value)}
      renderInput={(params) => {
        return <Input {...params} {...inputProps} />;
      }}
      {...props}
    />
  );
};
