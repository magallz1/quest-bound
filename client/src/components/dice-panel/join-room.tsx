import { Room } from '@/libs/compass-api';
import {
  Button,
  ClickAwayListener,
  IconButton,
  Input,
  Loader,
  MenuItem,
  Select,
  Stack,
  Text,
  Tooltip,
} from '@/libs/compass-core-ui';
import { useNotifications } from '@/stores';
import { Link } from '@mui/icons-material';
import React from 'react';

interface Props {
  joinRoom: (roomId: string, passcode?: string) => Promise<boolean>;
  swapRooms: (roomId: string) => void;
  roomName: string;
  roomSlug: string;
  roomPasscode?: string;
  isGuestUser: boolean;
  availableRooms: Room[];
}

export const JoinRoom = ({
  roomName,
  roomSlug,
  availableRooms,
  joinRoom,
  swapRooms,
  isGuestUser,
  roomPasscode,
}: Props) => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [roomId, setRoomId] = React.useState<string | null>(null);
  const [passcode, setPasscode] = React.useState<string>();

  const { addNotification } = useNotifications();

  const handleSave = async () => {
    try {
      if (!roomId) return;
      setLoading(true);
      await joinRoom(roomId, passcode);
      setLoading(false);
      setOpen(false);
    } catch (e) {
      setLoading(false);
      addNotification({
        status: 'error',
        message: 'Failed to join room',
      });
    }
  };

  const handleCopy = () => {
    let link = `https://dddice.com/room/${roomSlug}`;
    if (roomPasscode) {
      link += `?passcode=${roomPasscode}`;
    }

    navigator.clipboard.writeText(link);
    addNotification({
      message: 'Copied Join Link',
    });
  };

  return (
    <>
      {open ? (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <div>
            <Stack direction='row' spacing={1}>
              <Input
                id='dice-room'
                sx={{ height: 30, width: 100 }}
                ignoreHelperText
                placeholder='Room ID'
                onChange={(e) => setRoomId(e.target.value)}
              />
              <Input
                id='dice-room-passcode'
                sx={{ height: 30, width: 100 }}
                ignoreHelperText
                placeholder='Passcode'
                onChange={(e) => setPasscode(e.target.value)}
              />
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave();
                }}
                disabled={!roomId}
                loading={loading}>
                Save
              </Button>
            </Stack>
          </div>
        </ClickAwayListener>
      ) : loading ? (
        <Loader color='info' />
      ) : isGuestUser ? (
        <Stack direction='row' spacing={2} alignItems='center'>
          <Text>{roomName}</Text>
          <Tooltip title={<Text>Copy Room</Text>}>
            <IconButton onClick={handleCopy}>
              <Link fontSize='small' />
            </IconButton>
          </Tooltip>
        </Stack>
      ) : (
        <Stack direction='row' spacing={2} alignItems='center'>
          <Select
            id='dice-room-select'
            value={roomSlug}
            ignoreHelperText
            onChange={(e) => swapRooms(e.target.value as string)}>
            {availableRooms.map(({ slug, name }) => (
              <MenuItem key={slug} value={slug}>
                <Text>{name}</Text>
              </MenuItem>
            ))}
          </Select>
          <Tooltip title={<Text>Copy Room</Text>}>
            <IconButton onClick={handleCopy}>
              <Link fontSize='small' />
            </IconButton>
          </Tooltip>
        </Stack>
      )}
    </>
  );
};
