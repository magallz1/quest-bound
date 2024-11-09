import { useFormik } from 'formik';
import { ChangeEvent, createContext, CSSProperties, ReactNode } from 'react';
import { Button, Stack } from '../../components';

export type FormikForm = {
  values: any;
  touched: any;
  errors: any;
  handleChange: (e: ChangeEvent<any>) => void;
  handleSubmit: () => void;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
};

export type FormAction = {
  label: string;
  onClick?: () => void;
  isSubmit?: boolean;
  disabled?: boolean;
  loading?: boolean;
  colorOverride?: 'inherit' | 'secondary' | 'primary' | 'success' | 'error' | 'info' | 'warning';
  component?: ReactNode;
};

interface FormProps {
  children: ReactNode;
  formik?: FormikForm;
  initialValues?: Record<any, any>;
  onSubmit?: (values: any) => void;
  validationSchema?: any;
  actions?: FormAction[];
  direction?: 'row' | 'column';
  loading?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
  spacing?: number;
  center?: boolean;
}

interface FormContextValues {
  formik: FormikForm;
  formLoading: boolean;
  formDisabled: boolean;
}

export const FormContext = createContext<FormContextValues>(null!);

/**
 * Wraps form elements in a context provider that provides formik context.
 *
 * If formik is not provided, it will create a formik instance with the provided initialValues, onSubmit and validationSchema (yup object).
 *
 * The ID provided to FormInput should match a key in initialValues. If no ID is provided, it will contruct one from the label.
 */
export const Form = ({
  children,
  actions,
  formik,
  initialValues,
  validationSchema,
  onSubmit,
  direction = 'column',
  spacing = 2,
  loading = false,
  disabled = false,
  style,
  center = false,
}: FormProps) => {
  const defaultFormik = useFormik({
    // Not used if onSubmit is undefined
    initialValues: initialValues!,
    onSubmit: onSubmit!,
    validationSchema,
  });

  if (!formik && (!onSubmit || !initialValues)) {
    console.warn('Form requires either formik or onSubmit and initialValues to be provided.');
  }

  const internalFormik = formik ?? defaultFormik;

  return (
    <FormContext.Provider
      value={{ formik: internalFormik, formLoading: loading, formDisabled: disabled }}>
      <form
        style={{ marginTop: 0, height: '100%', width: '100%', overflow: 'auto', ...style }}
        onSubmit={(e) => {
          e.preventDefault();
        }}>
        <Stack
          padding={2}
          spacing={spacing}
          style={{ alignItems: 'center', justifyContent: 'center', ...style }}
          direction={direction}>
          {children}
        </Stack>
        {actions?.length && (
          <Stack
            direction='row'
            justifyContent={center ? 'center' : 'flex-end'}
            spacing={2}
            alignItems='flex-end'
            sx={{ flexGrow: 1, mt: '8px', position: 'absolute', right: 70, bottom: 35 }}>
            {actions?.map((action, i) =>
              action.component ? (
                <div key={i}>{action.component}</div>
              ) : (
                <Button
                  key={i}
                  onClick={(e) => {
                    e.preventDefault();
                    action.onClick?.();
                    if (action.isSubmit) internalFormik.handleSubmit();
                  }}
                  disabled={disabled || action.disabled || (!action.isSubmit && loading)}
                  loading={action.loading || (action.isSubmit && loading)}
                  type={action.isSubmit ? 'submit' : 'button'}
                  color={action.colorOverride ?? (action.isSubmit ? 'secondary' : 'inherit')}
                  variant={action.isSubmit ? 'contained' : 'text'}>
                  {action.label}
                </Button>
              ),
            )}
          </Stack>
        )}
      </form>
    </FormContext.Provider>
  );
};
