import { NotificationPriority, useNotifications } from '@/stores';
import { Input, Stack, Text } from '@chakra-ui/react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { motion } from 'framer-motion';
import debounce from 'lodash.debounce';
import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { useCurrentUser, useUpdateCurrentUser } from '../hooks';

// Regex for a username with no spaces and some special characters
const validUsernameRegex = /^[a-zA-Z0-9_@]+$/;

interface SetUsernameInputProps {
  style?: CSSProperties;
  inputStyle?: CSSProperties;
  setDisableSave?: (shouldDisable: boolean) => void;
}

export const SetUsernameInput = ({ setDisableSave, style, inputStyle }: SetUsernameInputProps) => {
  const { currentUser } = useCurrentUser();
  const { updateCurrentUser } = useUpdateCurrentUser();
  const { addNotification } = useNotifications();

  const [username, setUsername] = useState<string>(currentUser?.username ?? '');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const validationError = !validUsernameRegex.test(username);

  useEffect(() => {
    if (username !== currentUser?.username) {
      setDisableSave?.(true);
    } else {
      setDisableSave?.(validationError);
    }
    setError(undefined);
  }, [username, validationError, currentUser?.username]);

  const handleSave = async (username: string, currentUserName: string) => {
    try {
      const validationError = !validUsernameRegex.test(username);

      setError(undefined);

      if (username.toLowerCase() === 'questbound') {
        setError('Not available');
        return;
      }

      if (validationError) return;
      if (username === currentUserName) {
        setDisableSave?.(false);
        return;
      }

      setDisableSave?.(true);
      setLoading(true);

      await updateCurrentUser({ input: { username } });

      addNotification({
        priority: NotificationPriority.LOW,
        message: 'Updated username',
        status: 'success',
      });
    } catch (e: any) {
      if (e.message.includes('Unique constraint')) {
        setError('Not available');
      }
      addNotification({
        priority: NotificationPriority.LOW,
        message: 'Failed to update username',
        status: 'error',
      });
    } finally {
      setLoading(false);
      setDisableSave?.(false);
    }
  };

  const debouncedSave = useMemo(() => debounce(handleSave, 700, { trailing: true }), []);

  useEffect(() => {
    debouncedSave(username, currentUser?.username ?? '');
  }, [username]);

  const errorMessage =
    username.length === 0
      ? 'Username is required'
      : error ?? (validationError ? 'No spaces or special characters allowed' : undefined);

  return (
    <Stack spacing={1} sx={{ width: 180, ...style }}>
      <Stack direction='row' spacing={2} alignItems='center' style={style}>
        <Input
          isInvalid={!!errorMessage}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
        />
        {loading ? (
          <motion.div
            initial={{
              height: 24,
              width: 24,
              opacity: 0,
              backgroundColor: 'grey',
              borderRadius: '50%',
            }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ) : errorMessage ? (
          <ErrorIcon fontSize='small' color='error' />
        ) : (
          <CheckCircleIcon fontSize='small' color='success' />
        )}
      </Stack>
      {errorMessage ? (
        <Text fontSize='0.9rem' fontStyle='italic' color='error'>
          {errorMessage}
        </Text>
      ) : null}
    </Stack>
  );
};
