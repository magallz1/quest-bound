import { useQuickCreate } from '@/hooks';
import { Attribute, AttributeType, useAttributes } from '@/libs/compass-api';
import { AutoComplete, AutoCompleteOption, Checkbox, Input } from '@/libs/compass-core-ui';
import React, { useState } from 'react';

interface AttributeLookupProps {
  onSelect?: (attribute: Attribute | null) => void;
  onMultiSelect?: (attributes: Attribute[]) => void;
  className?: string;
  multiple?: boolean;
  attributeId?: string;
  attributeIds?: string[];
  label?: string;
  style?: React.CSSProperties;
  filterIds?: string[];
  filterByType?: AttributeType;
  filterOutByType?: AttributeType[];
  placeholder?: string;
  injectedOptions?: AutoCompleteOption[];
  disablePortal?: boolean;
}

export const AttributeLookup = ({
  onSelect,
  onMultiSelect,
  multiple = false,
  className,
  attributeId,
  attributeIds,
  label,
  style,
  filterIds = [],
  filterByType,
  filterOutByType = [],
  placeholder,
  injectedOptions = [],
  disablePortal = false,
}: AttributeLookupProps) => {
  const { setQuickCreatePage } = useQuickCreate();
  const { attributes: _attributes, loading } = useAttributes();
  const { attributes: items, loading: itemsLoading } = useAttributes(false, AttributeType.ITEM);

  const [inputValue, setInputValue] = useState('');

  const isItemLookup = filterByType === AttributeType.ITEM;

  const attributes = isItemLookup ? items : _attributes;

  const _options = attributes
    .filter((attr) => (!filterByType ? true : attr.type === filterByType))
    .filter((attr) => !filterOutByType.includes(attr.type))
    .map((attr) => ({
      label: attr.name,
      value: attr.id,
    }))
    .filter((attr) => !filterIds.includes(attr.value));

  const options = [...injectedOptions, ..._options];

  const selectedOption = options.find((opt) => opt.value === attributeId) ?? null;
  const selectedMultiOptions = options.filter((opt) => attributeIds?.includes(opt.value));

  const handleSelect = (option: AutoCompleteOption | AutoCompleteOption[] | null) => {
    if (option === null) {
      setInputValue('');
    }

    if (multiple) {
      const selection = option as AutoCompleteOption[];
      const selectedAttributes = selection
        ? attributes.filter((attr) => selection.find((sel) => sel.value === attr.id))
        : [];
      onMultiSelect?.(selectedAttributes);
    } else {
      const selection = option as AutoCompleteOption;
      const selectedAttribute = option
        ? attributes.find((attr) => attr.id === selection.value)
        : null;
      onSelect?.(selectedAttribute ?? null);
    }
  };

  const onCreateAttribute = () => {
    if (!inputValue) return;
    setQuickCreatePage('attribute', { name: inputValue });
  };

  const inputProps = {
    id: 'attribute-select',
    label,
    ignoreHelperText: true,
    placeholder: placeholder ?? (isItemLookup ? 'Search by item name' : 'Search by attribute name'),
  };

  return (
    <AutoComplete
      sx={{ width: 250, ...style }}
      multiple={multiple}
      size='small'
      disablePortal={disablePortal}
      className={className}
      loading={loading || itemsLoading}
      options={options}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          onCreateAttribute();
        }
      }}
      inputValue={inputValue}
      onInputChange={(_, value) => setInputValue(value)}
      value={multiple ? selectedMultiOptions : selectedOption}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      noOptionsText={
        isItemLookup
          ? 'No items found'
          : !!inputValue
            ? `Press enter to create ${inputValue}`
            : 'No attributes found'
      }
      disableCloseOnSelect={multiple}
      limitTags={3}
      onChange={(_, option) => handleSelect(option)}
      renderInput={(params) => <Input {...params} {...inputProps} />}
      renderTags={() => <></>}
      renderOption={
        multiple
          ? (props, option, { selected }) => (
              <li {...props}>
                <Checkbox style={{ marginRight: 8 }} checked={selected} />
                {option.label}
              </li>
            )
          : undefined
      }
    />
  );
};
