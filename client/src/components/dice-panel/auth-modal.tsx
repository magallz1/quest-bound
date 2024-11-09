import { Img } from '@/libs/compass-core-composites';
import { IconButton, Link, Loader, Modal, Stack, Text, Tooltip } from '@/libs/compass-core-ui';
import { Logout } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import dddiceImg from '../../assets/dddice.png';

interface Props {
  createAuthCode: () => Promise<string>;
  pollForAuth: (code: string) => void;
  clearPoll: () => void;
  username?: string;
  logout: () => void;
  isGuestUser: boolean;
}

export const AuthModal = ({
  createAuthCode,
  pollForAuth,
  clearPoll,
  username,
  logout,
  isGuestUser,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (username) {
      setOpen(false);
    }
  }, [username]);

  const handleOpen = async () => {
    setOpen(true);
    setLoading(true);
    const code = await createAuthCode();
    setCode(code);
    setLoading(false);

    pollForAuth(code);
  };

  return (
    <>
      <Stack direction='row' alignItems='center' spacing={2}>
        <Img src={dddiceImg} style={{ height: 30, width: 30 }} />
        {!isGuestUser ? (
          <Stack direction='row' spacing={2} alignItems='center'>
            <Text>{username}</Text>
            <IconButton title='Logout' onClick={logout}>
              <Logout fontSize='small' />
            </IconButton>
          </Stack>
        ) : (
          <Tooltip title={<Text>Sign in with dddice</Text>} placement='top'>
            <Text className='clickable' onClick={handleOpen} sx={{ textDecoration: 'underline' }}>
              Guest User
            </Text>
          </Tooltip>
        )}
      </Stack>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          clearPoll();
        }}>
        <Stack alignItems='center' spacing={2}>
          {loading ? (
            <Loader color='info' />
          ) : (
            <>
              <Text>Go to</Text>
              <Link
                href={`https://dddice.com/activate?code=${code}`}
                target='_blank'
                sx={{
                  color: 'common.white',
                  fontSize: '1.4rem',
                  textDecoration: 'underline',
                }}>
                dddice.com/activate
              </Link>
              <Text>and enter this code:</Text>
              <Text sx={{ fontSize: '1.4rem' }}>{code}</Text>
            </>
          )}
        </Stack>
      </Modal>
    </>
  );
};
