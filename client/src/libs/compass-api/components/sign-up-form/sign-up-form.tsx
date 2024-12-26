import {
  Button,
  Form,
  FormInput,
  Input,
  Modal,
  Stack,
  Text,
} from "@/libs/compass-core-ui";
import { useNotifications } from "@/stores";
import { useFormik } from "formik";
import { CSSProperties, useState } from "react";
import { useUpgradeUser } from "../../hooks";
import {
  FormValues,
  initialValues,
  signUpValidationSchema,
} from "./form-validation";

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
export const SignUpForm = ({
  title,
  style,
  disabled = false,
}: SignUpFormProps) => {
  const { addNotification } = useNotifications();
  const { signupUser } = useUpgradeUser();

  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>();
  const [linkSent, setLinkSent] = useState<boolean>(false);

  const formik = useFormik<FormValues>({
    initialValues,
    validationSchema: signUpValidationSchema,
    onSubmit: (values: FormValues) => {
      handleLoginOrSignup(values);
    },
  });

  // Use when requiring OTP authentication
  const handleOTPVerification = async ({ email, token }: FormValues) => {
    try {
      setLoading(true);

      /*
        Hook into your auth provider here
      */

      const { error, data } = {
        error: { message: "no auth provider" },
        data: null,
      };

      if (error) {
        throw Error(error.message);
      }
    } catch (e) {
      addNotification({
        status: "error",
        message: "Unable to verify one-time password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // User when auth is not required
  const handleLoginOrSignup = async (values: FormValues) => {
    try {
      setLoading(true);

      await signupUser(values.email);
    } catch (e: any) {
      addNotification({
        status: "error",
        message:
          e.message.length <= 200
            ? e.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack
        sx={{ minWidth: "350px", ...style }}
        alignItems="center"
        justifyContent="center"
        spacing={2}
      >
        {title && <Text variant="h5">{title}</Text>}
        {!linkSent ? (
          <Form
            center
            formik={formik}
            direction="column"
            spacing={1}
            style={{ minWidth: "200px" }}
          >
            <FormInput
              id={"email"}
              disabled={disabled}
              label=""
              autoComplete
              placeholder="Email"
              errorOverride={error}
            />
            <Button
              loading={loading}
              disabled={disabled}
              color="secondary"
              onClick={() => formik.submitForm()}
            >
              Submit
            </Button>
          </Form>
        ) : (
          <Stack spacing={2} sx={{ minWidth: "350px" }} alignItems="center">
            <Text>{`Login link sent to ${formik.values.email}`}</Text>

            <Button
              color="secondary"
              variant="contained"
              onClick={() => handleLoginOrSignup(formik.values)}
            >
              Resend
            </Button>
          </Stack>
        )}
      </Stack>

      <Modal open={linkSent}>
        <Stack spacing={4}>
          <Text>Enter the one-time passcode sent to your email</Text>

          <Input
            id="otp"
            placeholder="One-time Passcode"
            onChange={(e) => formik.setFieldValue("token", e.target.value)}
            helperText="Enter 6 digit code from email"
          />

          <Button
            color="info"
            onClick={() => handleOTPVerification(formik.values)}
            loading={loading}
          >
            Verify
          </Button>
        </Stack>
      </Modal>
    </>
  );
};
