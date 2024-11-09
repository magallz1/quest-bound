import { FormControl, FormControlLabel, FormHelperText, Switch, SwitchProps } from '@mui/material';
import { ChangeEvent, useContext } from 'react';
import { FormContext } from './form';

interface FormSwitchProps extends Partial<SwitchProps> {
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

export const FormSwitch = ({
  label,
  id,
  labelPlacement = 'end',
  errorOverride,
  helperText,
  ...others
}: FormSwitchProps) => {
  const { formik, formDisabled } = useContext(FormContext);

  return (
    <FormControl fullWidth>
      <FormControlLabel
        id={id}
        label={label}
        labelPlacement={labelPlacement}
        name={id}
        control={
          <Switch
            checked={formik.values[id]}
            onChange={(e) => formik.handleChange(e as ChangeEvent<any>)}
            {...others}
            disabled={formDisabled || others.disabled}
          />
        }
      />
      <FormHelperText sx={{ color: 'error.main' }}>
        {errorOverride || (formik.touched[id] && formik.errors[id]) || helperText}
      </FormHelperText>
    </FormControl>
  );
};
