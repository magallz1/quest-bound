import * as yup from 'yup';

export type FormValues = {
  email: string;
  password?: string;
  token: string;
};

export const initialValues: FormValues = {
  email: '',
  password: '',
  token: '',
};

export const signUpValidationSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
});
