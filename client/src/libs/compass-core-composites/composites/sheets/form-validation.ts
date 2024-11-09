import * as yup from 'yup';

export type FormValues = {
  title: string;
  description: string;
};

export const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string(),
});
