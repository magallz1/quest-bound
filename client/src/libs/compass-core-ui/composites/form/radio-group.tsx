import { FormControl, FormHelperText, FormLabel, RadioGroup, RadioGroupProps } from '@mui/material';
import { useContext } from 'react';
import { FormContext } from './form';

interface FormRadioGroupProps extends Partial<RadioGroupProps> {
  /**
   * Used to match input to formik values.
   */
  id: string;

  /**
   * Optionally renders a label
   */
  label?: string;

  /**
   * Manually trigger error state regardless of formik state.
   */
  errorOverride?: string;

  /**
   * Renders input helper text when field is not in error state.
   */
  helperText?: string;

  labelPlacement?: 'bottom' | 'end' | 'start' | 'top';
}

export const FormRadioGroup = ({
  label,
  id,
  labelPlacement = 'end',
  helperText,
  errorOverride,
  children,
  ...others
}: FormRadioGroupProps) => {
  const { formik, formDisabled } = useContext(FormContext);

  return (
    <FormControl fullWidth>
      <FormLabel id={`label-${id}`} sx={{ color: formDisabled ? 'text.disabled' : 'inherit' }}>
        {label}
      </FormLabel>
      <RadioGroup
        {...others}
        aria-labelledby={`label-${id}`}
        name={id}
        value={formik.values[id]}
        onChange={formik.handleChange}>
        {children}
      </RadioGroup>
      <FormHelperText sx={{ color: 'error.main' }}>
        {errorOverride || (formik.touched[id] && formik.errors[id]) || helperText}
      </FormHelperText>
    </FormControl>
  );
};
