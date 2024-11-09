import { FormControl, FormGroup, FormHelperText } from '@mui/material';
import { ChangeEvent, useContext } from 'react';
// import { Checkbox, CheckboxProps } from '../../components';
import { Checkbox, CheckboxProps } from '@chakra-ui/react';
import { FormContext } from './form';

interface FormCheckboxProps extends Partial<CheckboxProps> {
  /**
   * Used to match input to formik values.
   */
  id: string;

  /**
   * Optionally renders a label
   */
  label?: string;

  disabled?: boolean;

  /**
   * Manually trigger error state regardless of formik state.
   */
  errorOverride?: string;

  /**
   * Renders input helper text when field is not in error state.
   */
  helperText?: string;

  labelPlacement?: 'bottom' | 'end' | 'start' | 'top';

  fullWidth?: boolean;
}

export const FormCheckbox = ({
  label,
  id,
  labelPlacement = 'end',
  errorOverride,
  helperText,
  fullWidth,
  ...others
}: FormCheckboxProps) => {
  const { formik, formDisabled } = useContext(FormContext);

  return (
    <FormControl fullWidth={fullWidth}>
      <FormGroup>
        <Checkbox
          id={id}
          isChecked={formik.values[id]}
          onChange={(e) => formik.handleChange(e as ChangeEvent<any>)}
          {...others}
          disabled={formDisabled || others.disabled}>
          {label}
        </Checkbox>
        <FormHelperText sx={{ color: 'error.main' }}>
          {errorOverride || (formik.touched[id] && formik.errors[id]) || helperText}
        </FormHelperText>
      </FormGroup>
    </FormControl>
  );
};
