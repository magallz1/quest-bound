import { UploadAvatar } from '@/components/upload-avatar';
import {
  JoinDiscord,
  SetUsernameInput,
  useCurrentUser,
  useUpdateCurrentUser,
} from '@/libs/compass-api';
import {
  FormCheckbox,
  Modal,
  Stack,
  Text,
  useDeviceSize,
  Wizard,
  WizardStep,
} from '@/libs/compass-core-ui';
import { Link } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';

type FormValues = {
  acknowledged: boolean;
  terms: boolean;
};

export const Onboarding = () => {
  const { mobile } = useDeviceSize();

  const { currentUser, loading: userLoading } = useCurrentUser();
  const { updateCurrentUser, loading: updateLoading } = useUpdateCurrentUser();
  const [open, setOpen] = useState<boolean>(false);
  const [usernameLoading, setUsernameLoading] = useState<boolean>(false);

  const loading = updateLoading || userLoading;

  useEffect(() => {
    if (!!currentUser && !userLoading) {
      setOpen(!currentUser.onboarded);
    }
  }, [currentUser, userLoading]);

  const formik = useFormik<FormValues>({
    initialValues: {
      acknowledged: false,
      terms: false,
    },
    onSubmit: async (values) => {
      await updateCurrentUser({
        input: {
          onboarded: true,
        },
      });
      setOpen(false);
    },
  });

  const steps = ['Welcome', 'Terms', 'Username', 'Avatar', 'Complete'];

  return (
    <Modal open={open}>
      <Wizard
        title={mobile ? 'Setup' : ''}
        steps={steps}
        submitLabel='Finish'
        formik={formik}
        hideSteps
        style={{ minWidth: mobile ? 250 : 650 }}
        loading={loading}>
        <WizardStep nextDisabled={!formik.values.acknowledged}>
          <Stack
            alignItems='center'
            spacing={8}
            minHeight={400}
            sx={{ mt: 2 }}
            justifyContent='flex-start'>
            <Stack direction={mobile ? 'column' : 'row'} spacing={1}>
              <Text variant='h3'>Welcome to</Text>
              <Text variant='h3' sx={{ color: 'secondary.main' }}>
                Quest Bound!
              </Text>
            </Stack>
            <Stack spacing={2} alignItems='center'>
              <Text sx={{ textAlign: 'center', maxWidth: 350 }}>
                Quest Bound is currently in Early Access, which means it is still undergoing testing
                and development. There may be bugs, errors, or other issues that could affect its
                performance.
              </Text>

              <Text sx={{ textAlign: 'center', maxWidth: 350 }}>
                The features and functionalities of this version may be limited compared to the
                final release. Some features may not be fully implemented, and others may be subject
                to change.
              </Text>

              <FormCheckbox label='I Understand' id='acknowledged' />
            </Stack>
          </Stack>
        </WizardStep>

        <WizardStep nextDisabled={!formik.values.terms}>
          <Stack
            alignItems='center'
            spacing={8}
            minHeight={400}
            sx={{ mt: 2 }}
            justifyContent='flex-start'>
            <Stack direction={mobile ? 'column' : 'row'} spacing={1}>
              <Text variant='h3'>Please read and accept the following terms</Text>
            </Stack>
            <Stack spacing={2} alignItems='center'>
              <Link target='_blank' href='https://docs.questbound.com/docs/terms'>
                Terms of Use
              </Link>
              <Link target='_blank' href='https://docs.questbound.com/docs/privacy'>
                Privacy Policy
              </Link>
              <Link target='_blank' href='https://docs.questbound.com/docs/dmca'>
                DMCA Policy
              </Link>

              <Text sx={{ textAlign: 'center', maxWidth: 350 }}>In short:</Text>
              <ul>
                <li>You must own the rights to recreate any content you upload to Quest Bound</li>
                <li>
                  You must own the rights to distribute any content you share through Quest Bound
                </li>
                <li>
                  Quest Bound makes no claim of ownership over any content you upload or share
                </li>
              </ul>
              <FormCheckbox label='I Accept' id='terms' />
            </Stack>
          </Stack>
        </WizardStep>

        <WizardStep nextDisabled={usernameLoading}>
          <Stack
            alignItems='center'
            spacing={8}
            justifyContent='flex-start'
            minHeight={400}
            sx={{ mt: 2 }}>
            <Text variant='h4' sx={{ textAlign: 'center' }}>
              Choose a Username
            </Text>
            <SetUsernameInput setDisableSave={setUsernameLoading} />
          </Stack>
        </WizardStep>

        <WizardStep>
          <Stack
            alignItems='center'
            spacing={4}
            justifyContent='flex-start'
            minHeight={400}
            sx={{ mt: 2 }}>
            <Text variant='h4' sx={{ textAlign: 'center' }}>
              Set Your Profile Image
            </Text>

            <UploadAvatar />

            <Text>Click the menu icon in the top right corner of the image placeholder.</Text>
          </Stack>
        </WizardStep>

        <WizardStep>
          <Stack spacing={8} alignItems='center' minHeight={400} maxWidth={400} sx={{ mt: 2 }}>
            <Text variant='h4' sx={{ textAlign: 'center', color: 'secondary.main' }}>
              You're All Set
            </Text>

            <Text sx={{ textAlign: 'center' }}>
              Join our Discord server to follow updates and meet the community.
            </Text>

            <JoinDiscord />
          </Stack>
        </WizardStep>
      </Wizard>
    </Modal>
  );
};
