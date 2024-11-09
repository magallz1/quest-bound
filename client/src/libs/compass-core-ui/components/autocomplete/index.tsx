import AutoComplete, {
  AutocompleteProps as MUIAutocompleteProps,
} from '@mui/material/Autocomplete';

export type AutoCompleteProps = MUIAutocompleteProps<any, true, false, true>;

export type AutoCompleteOption = {
  label: string;
  value: string;
};

export { AutoComplete };

// export const AutoComplete = ({ ...baseProps }: AutoCompleteProps): JSX.Element => (
//   <MUIAutocomplete {...baseProps} />
// );
