import { ClickAwayListener, Input, InputProps, Text, TextProps } from '@/libs/compass-core-ui';
import { useKeyListeners } from '@/libs/compass-web-utils';
import React, { createRef, useEffect, useState } from 'react';

interface Props extends Omit<TextProps, 'onChange'> {
  children?: React.ReactNode;
  inputProps?: Omit<InputProps, 'id'>;
  onChange?: (value: string | number) => void;
  onReset?: () => void;
  initialValue?: string | number;
  number?: boolean;
}

export const EditableText = ({
  children,
  inputProps,
  onChange,
  onReset,
  initialValue,
  number = false,
  ...textProps
}: Props) => {
  const [editing, setEditing] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string | number>(initialValue ?? '');

  const ref = createRef<HTMLInputElement>();

  useEffect(() => {
    if (initialValue) setEditValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (editing) {
      ref.current?.focus();
    }
  }, [ref.current, editing]);

  useKeyListeners({
    onKeyDown: (e) => {
      if (e.key === 'Enter') handleChange();
      if (e.key === 'Escape') setEditing(false);
    },
    disabled: !editing,
  });

  const handleChange = () => {
    if (editValue) {
      onChange?.(editValue);
    } else {
      onReset?.();
    }
    setEditing(false);
  };

  return editing ? (
    <ClickAwayListener onClickAway={() => setEditing(false)}>
      <Input
        id='editable-text-input'
        type={number ? 'number' : 'text'}
        ref={ref}
        {...inputProps}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleChange}
        ignoreHelperText={inputProps?.ignoreHelperText ?? true}
      />
    </ClickAwayListener>
  ) : (
    <Text className='clickable' onClick={() => setEditing(true)} {...textProps}>
      {children}
    </Text>
  );
};
