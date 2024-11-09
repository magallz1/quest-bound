import { Button, Modal, Paper, Stack, Text } from '@/libs/compass-core-ui';
import { NotificationPriority, useNotifications } from '@/stores';
import { AnimatePresence, motion } from 'framer-motion';

const statusToColor = new Map<string, string>([
  ['info', 'info.main'],
  ['error', 'error.main'],
  ['success', 'success.main'],
  ['warn', 'warning.main'],
]);

const NotificationSnackbar = () => {
  const { notifications } = useNotifications();

  const lowPriorityNotifications = notifications.filter(
    (note) => note.priority === NotificationPriority.LOW,
  );

  const notification = lowPriorityNotifications[0];

  return (
    <AnimatePresence>
      {!!notification && (
        <motion.div
          key={notification.id}
          initial={{
            position: 'fixed',
            zIndex: 100000,
            bottom: 50,
            left: -500,
          }}
          animate={{
            left: [-500, 20],
          }}
          exit={{
            left: [20, -500],
          }}
          transition={{ duration: 0.5 }}>
          <Stack
            direction='row'
            alignItems='center'
            spacing={0}
            sx={{
              borderRadius: '8px',
              flexWrap: 'wrap',
              bgcolor: 'background.paper',
              minHeight: '50px',
              minWidth: '150px',
              maxWidth: '250px',
              padding: 2,
              gap: '15px',
              backgroundColor: statusToColor.get(notification.status!),
            }}>
            <Text>{notification.message}</Text>
            {notification.actions?.length && (
              <Button variant='text' color='secondary' onClick={notification.actions[0].onClick}>
                {notification.actions[0].label}
              </Button>
            )}
          </Stack>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const NotificationBanner = () => {
  const { notifications, removeNotification } = useNotifications();

  const mediumPriorityNotifications = notifications.filter(
    (note) => note.priority === NotificationPriority.MEDIUM,
  );

  const notification = mediumPriorityNotifications[0];

  return (
    <div className='notification-framework-banner'>
      <AnimatePresence>
        {!!notification && (
          <motion.div
            key={notification.id}
            initial={{
              opacity: 0,
              zIndex: 100000,
              position: 'absolute',
              left: 0,
              top: 0,
            }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}>
            <Paper>
              <Stack
                direction='row'
                alignItems='center'
                justifyContent='center'
                spacing={2}
                sx={{
                  borderRadius: '8px',
                  flexWrap: 'wrap',
                  minHeight: '50px',
                  width: '100vw',
                  padding: 2,
                  backgroundColor: statusToColor.get(notification.status!),
                }}>
                <Text
                  sx={{
                    color: notification.status === 'warn' ? 'common.black' : 'common.white',
                  }}>
                  {notification.message}
                </Text>

                {notification.actions?.map(
                  (action, i) =>
                    i < 2 && (
                      <Button key={i} onClick={action.onClick}>
                        {action.label}
                      </Button>
                    ),
                )}

                {notification.dismissable && (
                  <Button
                    variant='text'
                    color={notification.status === 'warn' ? 'primary' : 'secondary'}
                    sx={{
                      color: notification.status === 'warn' ? 'common.black' : undefined,
                    }}
                    onClick={() => removeNotification(notification.id)}>
                    Dismiss
                  </Button>
                )}
              </Stack>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NotificationDialog = () => {
  const { notifications, removeNotification } = useNotifications();

  const highPriorityNotifications = notifications.filter(
    (note) => note.priority === NotificationPriority.HIGH,
  );

  const notification = highPriorityNotifications[0];

  if (!notification) return null;

  return (
    <Modal
      size='small'
      open={!!notification}
      onClose={() => removeNotification(notification.id)}
      actions={notification.actions}>
      {notification.message}
    </Modal>
  );
};

export const RenderNotifications = () => (
  <>
    <NotificationSnackbar />
    <NotificationBanner />
    <NotificationDialog />
  </>
);
