import { Avatar } from '../components/avatar';
import { Stack } from '../components/stack';
import { Text } from '../components/text';
interface UserDetailsProps {
  avatarSrc?: string | null;
  username?: string | null;
  email?: string | null;
}

export const UserDetails = ({ avatarSrc, username, email }: UserDetailsProps) => {
  return (
    <Stack direction='row' spacing={2} alignItems='center'>
      <Avatar
        sx={{ height: 30, width: 30 }}
        alt='Profile'
        variant='rounded'
        src={avatarSrc || undefined}>
        {username?.charAt(0)}
      </Avatar>
      <Stack>
        {!!username && <Text sx={{ fontSize: '1rem' }}>{username}</Text>}
        {!!email && (
          <Text variant='subtitle2' sx={{ opacity: 0.7 }}>
            {email}
          </Text>
        )}
      </Stack>
    </Stack>
  );
};
