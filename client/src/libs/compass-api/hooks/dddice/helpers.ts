import axios from 'axios';
import Cookies from 'js-cookie';
import { Arguments, DiceTheme, DiceUser, Room } from './types';

const getToken = (guest = false) => {
  if (guest) {
    return Cookies.get('dddice-guest-user-token');
  }
  return Cookies.get('dddice-user-token');
};

export const setToken = (token: string, guest = false) => {
  if (guest) {
    Cookies.set('dddice-guest-user-token', token);
  } else {
    Cookies.set('dddice-user-token', token);
  }
};

const removeToken = () => {
  Cookies.remove('dddice-user-token');
};

export const authenticateDddiceUser = async (): Promise<DiceUser> => {
  const authUserToken = getToken();
  const guestUserToken = getToken(true);

  const token = authUserToken ?? guestUserToken;
  const isGuest = !authUserToken;

  if (token) {
    const user = await getUser(token);
    const { slug, name, passcode, rooms } = await getLastRoom(token, isGuest);
    const theme = await getLastTheme(token);
    return {
      roomSlug: slug,
      roomName: name,
      lastTheme: theme ?? undefined,
      roomPasscode: passcode,
      userToken: token,
      username: user.data.username,
      userId: user.data.uuid,
      rooms: !isGuest ? rooms : [],
      isGuest,
    };
  }

  const res = await bootstrapGuestUser();
  return res;
};

const bootstrapGuestUser = async () => {
  const userToken = await createGuestUser();
  setToken(userToken, true);

  const { slug, name } = await createRoom(userToken);
  localStorage.setItem('dddice-guest-room', slug);

  const guestUser = await getUser(userToken);

  return {
    roomSlug: slug,
    roomName: name,
    userToken,
    userId: guestUser.data.uuid,
    username: guestUser.data.username,
    rooms: [],
    isGuest: true,
  };
};

export const createAuthCode = async ({ clearPoll }: { clearPoll: () => void }) => {
  clearPoll();

  const res = await axios.post('https://dddice.com/api/1.0/activate');

  return {
    code: res.data.data.code,
    secret: res.data.data.secret,
  };
};

export const getAuthCode = async ({
  code,
  token,
  clearPoll,
}: Arguments): Promise<Partial<DiceUser>> => {
  const res = await axios.get(`https://dddice.com/api/1.0/activate/${code}`, {
    headers: {
      Authorization: `Secret ${token}`,
    },
  });

  if (res.data.data.token) {
    clearPoll();

    return {
      username: res.data.data.user.username,
      userToken: res.data.data.token,
      userId: res.data.data.user.uuid,
    };
  }

  return {
    username: '',
  };
};

export const getThemes = async ({ token }: Arguments) => {
  const res = await axios.get('https://dddice.com/api/1.0/dice-box', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

const getLastTheme = async (token: string): Promise<DiceTheme | null> => {
  const lastTheme = localStorage.getItem('last-dice-theme');
  if (!lastTheme) return null;

  const themes = await getThemes({ token, clearPoll: () => {} });
  const theme = themes.data.find((t: any) => t.id === lastTheme);
  if (!theme) return null;
  return {
    id: theme.id,
    label: theme.name,
    previews: theme.preview,
    availableDice: theme.available_dice ?? [],
    bannerPreview:
      theme.preview.preview ?? theme.preview.d20 ?? Object.values(theme.preview)[0] ?? '',
  };
};

export const disconnect = async (roomSlug: string, token: string) => {
  fetch(`https://dddice.com/api/1.0/room/${roomSlug}/participant`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getLastRoom = async (token: string, isGuest: boolean): Promise<Room & { rooms: Room[] }> => {
  const rooms = await getRooms(token);
  const prevSlug = isGuest
    ? localStorage.getItem('dddice-guest-room')
    : localStorage.getItem('dddice-room');
  if (prevSlug) {
    const prevRoom = rooms.find((r: any) => r.slug === prevSlug);
    if (prevRoom) {
      return {
        ...prevRoom,
        rooms,
      };
    }
  }
  const { slug, name } = await createRoom(token);
  const roomsWithNew = await getRooms(token);
  if (isGuest) {
    localStorage.setItem('dddice-guest-room', slug);
  } else {
    localStorage.setItem('dddice-room', slug);
  }
  return {
    slug,
    name,
    rooms: roomsWithNew,
  };
};

const createGuestUser = async () => {
  const res = await axios.post('https://dddice.com/api/1.0/user');

  return res.data.data;
};

const getUser = async (token: string) => {
  const res = await axios('https://dddice.com/api/1.0/user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getRooms = async (token: string): Promise<Room[]> => {
  const res = await axios('https://dddice.com/api/1.0/room', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.data;
};

const createRoom = async (token: string, name = 'Quest Bound'): Promise<Room> => {
  const res = await axios.post(
    'https://dddice.com/api/1.0/room',
    {
      name,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return { slug: res.data.data.slug, name: res.data.data.name };
};

export const joinRoom = async ({ token, roomId, passcode, username, userId }: Arguments) => {
  // User is already a member of the room
  const room = await axios.get(`https://dddice.com/api/1.0/room/${roomId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const currentParticipants = room.data.data.participants;
  let userParticipant = currentParticipants.find((p: any) => p.user.uuid === userId);

  if (userParticipant) {
    return {
      roomSlug: room.data.data.slug,
      numParticipants: room.data.data.participants.length,
      name: room.data.data.name,
    };
  }

  // Join room as new user
  const res = await axios.post(
    `https://dddice.com/api/1.0/room/${roomId}/participant`,
    {
      passcode,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const participants = room.data.data.participants;
  userParticipant = participants.find((p: any) => p.user.uuid === userId);

  // Update with QB username
  if (userParticipant && username) {
    await axios.patch(
      `https://dddice.com/api/1.0/room/${roomId}/participant/${userParticipant.id}`,
      {
        passcode,
        username,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  return {
    roomSlug: res.data.data.slug,
    numParticipants: res.data.data.participants.length,
    name: res.data.data.name,
  };
};

export const leaveRoom = async ({ token, roomId, userId }: Arguments) => {
  const room = await axios.get(`https://dddice.com/api/1.0/room/${roomId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const currentParticipants = room.data.data.participants;
  let userParticipant = currentParticipants.find((p: any) => p.user.uuid === userId);

  if (userParticipant) {
    const res = await axios.delete(
      `https://dddice.com/api/1.0/room/${roomId}/participant/${userParticipant.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  return true;
};

export const logout = () => {
  removeToken();
};
