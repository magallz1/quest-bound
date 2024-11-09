import { useContext } from 'react';
import { Input, InputProps } from '../../components';
import { FormContext } from './form';

interface FormInputProps extends Partial<InputProps> {
  /**
   * Must be provided and unique.
   */
  label: string;

  /**
   * Used to match input to formik values. If not provided, defaults to label.toLowerCase().replace(/ /g, '_');
   */
  id?: string;

  /**
   * If the label is an input type, that is used automatically. Falls back to 'text'
   */
  type?: string;

  /**
   * Manually trigger error state regardless of formik state.
   */
  errorOverride?: string;

  /**
   * Renders input helper text when field is not in error state.
   */
  helperText?: string;
}

// Maps common formik keys to input types.
const typeLabels = new Map([
  ['email', 'email'],
  ['password', 'password'],
  ['username', 'username'],
  ['name', 'username'],
  ['password_confirmation', 'password'],
  ['confirm', 'password'],
]);

export const FormInput = ({
  label,
  id,
  type = 'text',
  errorOverride,
  helperText,
  ...others
}: FormInputProps) => {
  const genId = id ?? label.toLowerCase().replace(/ /g, '_');

  const { formik, formDisabled } = useContext(FormContext);

  return (
    <Input
      disabled={formDisabled || others.disabled}
      {...others}
      inputProps={{
        autoComplete: others.autoComplete ? typeLabels.get(genId) ?? undefined : 'off',
        ...others.inputProps,
      }}
      autoComplete={others.autoComplete ?? true}
      id={genId}
      name={genId}
      label={label}
      type={typeLabels.get(genId) ?? type}
      value={formik.values[genId]}
      onChange={formik.handleChange}
      error={!!errorOverride || (formik.touched[genId] && Boolean(formik.errors[genId]))}
      helperText={errorOverride || (formik.touched[genId] && formik.errors[genId]) || helperText}
    />
  );
};
