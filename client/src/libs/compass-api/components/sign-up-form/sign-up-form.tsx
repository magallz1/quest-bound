import {
  Button,
  Form,
  FormInput,
  Input,
  Modal,
  Stack,
  Text,
  useDeviceSize,
} from '@/libs/compass-core-ui';
import { EnvContext } from '@/libs/compass-web-utils';
import { useNotifications } from '@/stores';
import { useFormik } from 'formik';
import { CSSProperties, useContext, useState } from 'react';
import { useAlphaUsers, useUpgradeUser } from '../../hooks';
import { SupabaseContext } from '../../provider';
import { FormValues, initialValues, signUpValidationSchema } from './form-validation';

interface SignUpFormProps {
  title?: string;
  style?: CSSProperties;
  disabled?: boolean;
}

/**
 * Signs a user up for the email newsletter.
 *
 *
 * If a user has been granted alpha access, logs them in or signs them up.
 *
 * If a user is already on the alpha waitlist, informs them.
 *
 * If a user is not on the alpha waitlist, prompts them to join the waitlist.
 */
export const SignUpForm = ({ title, style, disabled = false }: SignUpFormProps) => {
  const { isAlphaUser } = useAlphaUsers();
  const { client } = useContext(SupabaseContext);
  const { environment } = useContext(EnvContext);
  const { mobile } = useDeviceSize();
  const { addNotification } = useNotifications();
  const { signupUser } = useUpgradeUser();

  const [usePasswordSignIn, setUsePassword] = useState<boolean>(false);

  const location = window.location;

  const redirectLink =
    environment === 'prod'
      ? 'https://questbound.com'
      : location.hostname.includes('localhost')
        ? undefined
        : `https://${environment}.questbound.com`;

  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>();
  const [linkSent, setLinkSent] = useState<boolean>(false);

  const formik = useFormik<FormValues>({
    initialValues,
    validationSchema: signUpValidationSchema,
    onSubmit: (values: FormValues) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = (values: FormValues) => {
    if (usePasswordSignIn) {
      handlePasswordLogin(values);
    } else {
      handleLoginOrSignup(values);
    }
  };

  // Used for integ tests
  const handlePasswordLogin = async (values: FormValues) => {
    if (!values.password) return;

    await client.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
  };

  const handleOTPVerification = async ({ email, token }: FormValues) => {
    try {
      setLoading(true);
      const { error, data } = await client.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });

      if (error) {
        throw Error(error.message);
      }
    } catch (e) {
      addNotification({
        status: 'error',
        message: 'Unable to verify one-time password. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginOrSignup = async (values: FormValues) => {
    try {
      setLoading(true);
      const hasAccess = await isAlphaUser(values.email);

      if (!hasAccess) {
        await signupUser(values.email);
      }

      const { error } = await client.auth.signInWithOtp({
        email: values.email,
        options: {
          emailRedirectTo: redirectLink,
          shouldCreateUser: false,
        },
      });

      if (error) {
        throw Error(error.message);
      }

      setLinkSent(true);
    } catch (e: any) {
      // setError(e.message.length <= 200 ? e.message : 'Something went wrong. Please try again.');
      addNotification({
        status: 'error',
        message: e.message.length <= 200 ? e.message : 'Something went wrong. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (usePasswordSignIn) {
    return (
      <Stack
        sx={{ minWidth: '350px', ...style }}
        alignItems='center'
        justifyContent='center'
        spacing={2}>
        {title && <Text variant='h5'>{title}</Text>}
        <Form center formik={formik} direction='column' spacing={3} style={{ minWidth: '200px' }}>
          <FormInput
            id={'email'}
            disabled={disabled}
            ignoreHelperText
            label='Email'
            autoComplete
            placeholder='Email'
            errorOverride={error}
          />

          <FormInput
            id={'password'}
            disabled={disabled}
            label='Password'
            ignoreHelperText
            type='password'
            placeholder='Password'
            errorOverride={error}
          />

          <Button
            loading={loading}
            disabled={disabled}
            color='secondary'
            onClick={() => formik.submitForm()}>
            Submit
          </Button>
        </Form>
      </Stack>
    );
  }

  return (
    <>
      <Stack
        sx={{ minWidth: '350px', ...style }}
        alignItems='center'
        justifyContent='center'
        spacing={2}>
        {title && <Text variant='h5'>{title}</Text>}
        {!linkSent ? (
          <Form center formik={formik} direction='column' spacing={1} style={{ minWidth: '200px' }}>
            <FormInput
              id={'email'}
              disabled={disabled}
              label=''
              autoComplete
              placeholder='Email'
              errorOverride={error}
            />
            <Button
              loading={loading}
              disabled={disabled}
              color='secondary'
              onClick={() => formik.submitForm()}>
              Submit
            </Button>
          </Form>
        ) : (
          <Stack spacing={2} sx={{ minWidth: '350px' }} alignItems='center'>
            <Text>{`Login link sent to ${formik.values.email}`}</Text>

            <Button
              color='secondary'
              variant='contained'
              onClick={() => handleLoginOrSignup(formik.values)}>
              Resend
            </Button>
          </Stack>
        )}
      </Stack>

      <button
        id='password-signin'
        onClick={() => setUsePassword(true)}
        style={{ height: 1, width: 1, opacity: 0 }}></button>

      <Modal open={linkSent}>
        <Stack spacing={4}>
          <Text>Enter the one-time passcode sent to your email</Text>

          <Input
            id='otp'
            placeholder='One-time Passcode'
            onChange={(e) => formik.setFieldValue('token', e.target.value)}
            helperText='Enter 6 digit code from email'
          />

          <Button
            color='info'
            onClick={() => handleOTPVerification(formik.values)}
            loading={loading}>
            Verify
          </Button>
        </Stack>
      </Modal>
    </>
  );
};
