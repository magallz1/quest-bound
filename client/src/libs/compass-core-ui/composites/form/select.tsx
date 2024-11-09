import { ChangeEvent, useContext } from 'react';
import { Select, SelectProps } from '../../components';
import { FormContext } from './form';

interface FormSelectProps extends Partial<SelectProps> {
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

  ignoreHelperText?: boolean;
}

export const FormSelect = ({
  label,
  id,
  type = 'text',
  errorOverride,
  helperText,
  children,
  ignoreHelperText,
  ...others
}: FormSelectProps) => {
  const genId = id ?? label.toLowerCase().replace(/ /g, '_');

  const { formik, formDisabled } = useContext(FormContext);

  return (
    <Select
      disabled={formDisabled || others.disabled}
      {...others}
      id={genId}
      MenuProps={{ disablePortal: true }}
      name={genId}
      label={label}
      value={formik.values[genId]}
      onChange={(e) => formik.handleChange(e as ChangeEvent<any>)}
      error={!!errorOverride || (formik.touched[genId] && Boolean(formik.errors[genId]))}
      ignoreHelperText={ignoreHelperText}
      helperText={errorOverride || (formik.touched[genId] && formik.errors[genId]) || helperText}>
      {children}
    </Select>
  );
};
