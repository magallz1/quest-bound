import { SignUpForm, SocialLinks } from '@/libs/compass-api';
import {
  AnimatedSplashCard,
  Button,
  SplashCard,
  Stack,
  useDeviceSize,
} from '@/libs/compass-core-ui';
import { EnvContext } from '@/libs/compass-web-utils';
import { NotificationPriority, useNotifications } from '@/stores';
import { motion } from 'framer-motion';
import { useContext, useEffect } from 'react';

export const SignIn = () => {
  const { mobile } = useDeviceSize();

  const { maintenance, environment } = useContext(EnvContext);
  const enableMaintenance = maintenance.includes(environment);
  const { addNotification } = useNotifications();

  const bypassAuthorized = localStorage.getItem('bypassMaintenance') === 'true';

  useEffect(() => {
    if (enableMaintenance) {
      console.warn('Maintenance mode is enabled');
      if (!bypassAuthorized) {
        addNotification({
          status: 'warn',
          message: 'Quest Bound is currently undergoing maintenance and will be available soon.',
          priority: NotificationPriority.MEDIUM,
          dismissable: bypassAuthorized,
        });
      }
    }
  }, []);

  return (
    <Stack alignItems='center' pt={mobile ? 4 : 0}>
      <Stack alignItems='center' spacing={mobile ? 1 : 2}>
        {mobile ? <SplashCard /> : <AnimatedSplashCard delay={0.5} />}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: mobile ? 0 : 2.5 }}>
          <Stack alignItems='center'>
            <SignUpForm title='Login or Signup' disabled={enableMaintenance && !bypassAuthorized} />
            <Stack width='50%' sx={{ mt: mobile ? 1 : 2 }} spacing={1} alignItems='center'>
              <SocialLinks />
              <Button href='https://signup.questbound.com' target='_blank' variant='text'>
                Learn More
              </Button>
            </Stack>
          </Stack>
        </motion.div>
      </Stack>
    </Stack>
  );
};
