import { FormControlLabel, Radio, RadioProps } from '@mui/material';
import { useContext } from 'react';
import { FormContext } from './form';

interface FormRadioProps extends Partial<RadioProps> {
  /**
   * Used to match input to formik values.
   */
  id?: string;

  /**
   * Optionally renders a label
   */
  label: string;
}

export const FormRadio = ({ label, id, ...others }: FormRadioProps) => {
  const { formDisabled } = useContext(FormContext);
  const genId = id ?? label.toLowerCase().replace(' ', '-');

  return (
    <FormControlLabel
      value={genId}
      label={label}
      control={<Radio {...others} disabled={formDisabled || others.disabled} />}
    />
  );
};
