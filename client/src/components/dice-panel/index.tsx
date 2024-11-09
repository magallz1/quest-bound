import { Dice, useDice } from '@/libs/compass-api';
import { Img } from '@/libs/compass-core-composites';
import {
  Button,
  Divider,
  IconButton,
  Loader,
  Panel,
  Stack,
  Text,
  Tooltip,
  useDeviceSize,
} from '@/libs/compass-core-ui';
import { generateId, SettingsContext } from '@/libs/compass-web-utils';
import { Casino, Delete } from '@mui/icons-material';
import { useContext, useEffect, useRef, useState } from 'react';
import { AuthModal } from './auth-modal';
import { JoinRoom } from './join-room';
import { SelectDice } from './select-dice';
import { DiceThemes } from './themes';

export const DicePanel = () => {
  const { dicePanelOpen, setDicePanelOpen } = useContext(SettingsContext);
  const ref = useRef<HTMLCanvasElement>(null);

  const { mobile, desktop, tablet } = useDeviceSize();

  const {
    loading,
    roll,
    removeDice,
    error,
    userLoading,
    isGuestUser,
    swapRooms,
    logout,
    displayingRoll,
    getThemes,
    setDisplayingRoll,
    theme,
    setTheme,
    createAuthCode,
    pollForAuth,
    clearPoll,
    joinRoom,
    availableRooms,
    roomName,
    roomSlug,
    roomPasscode,
    username,
  } = useDice({
    canvasRef: ref,
  });

  const availableDice: Dice[] = theme.availableDice.map((notation) => {
    if (typeof notation === 'string') {
      return {
        type: notation,
        label: notation,
        id: generateId(),
      };
    }

    return {
      type: notation.type,
      label: notation.notation,
      id: notation.id ?? generateId(),
    };
  });

  const [dice, setDice] = useState<Dice[]>([]);

  // Display result is a string for non standard dice
  // Show display result if there's only one of these, remove all others from sum
  const total =
    dice.length === 1 && dice[0].displayResult
      ? dice[0].displayResult
      : dice
          .filter((die) => !die.displayImage)
          .map((die) => {
            if (die.staticValue) return die.staticValue;
            if (typeof die.displayResult === 'number') return parseFloat(die.displayResult);
            return die.result ?? 0;
          })
          .reduce((a, b) => a + b, 0);

  useEffect(() => {
    handleClear();
  }, [theme]);

  const handleRoll = async () => {
    removeDice();
    const res = await roll(dice);
    setDice(res);
  };

  const handleAdd = (d: Dice) => {
    setDice((prev) => [...prev, d]);
  };

  const handleRemove = async (id: string) => {
    setDice((prev) => prev.filter((die) => die.id !== id));
  };

  const handleClear = () => {
    setDice([]);
    removeDice();
    setDisplayingRoll(false);
  };

  return (
    <Panel
      open={dicePanelOpen}
      onClose={() => setDicePanelOpen(false)}
      style={{ backgroundColor: 'background.default' }}
      title={<Casino />}>
      <Stack justifyContent='center' alignItems='center' spacing={2}>
        {userLoading ? (
          <Loader color='info' />
        ) : error ? (
          <Text sx={{ color: 'error.main' }}>Failed to Connect</Text>
        ) : (
          <>
            <AuthModal
              createAuthCode={createAuthCode}
              pollForAuth={pollForAuth}
              clearPoll={clearPoll}
              logout={logout}
              username={username}
              isGuestUser={isGuestUser}
            />
            <JoinRoom
              joinRoom={joinRoom}
              swapRooms={swapRooms}
              roomName={roomName}
              roomPasscode={roomPasscode}
              availableRooms={availableRooms}
              roomSlug={roomSlug}
              isGuestUser={isGuestUser}
            />
          </>
        )}
      </Stack>

      {!isGuestUser && !userLoading && <DiceThemes getThemes={getThemes} setTheme={setTheme} />}

      {!userLoading && (
        <SelectDice
          theme={theme}
          previews={theme.previews}
          availableDice={availableDice}
          onAdd={handleAdd}
        />
      )}

      <Divider style={{ width: '100%' }} />

      <Stack
        width='100%'
        direction='row'
        padding={2}
        pl={6}
        pr={6}
        alignItems='center'
        justifyContent='space-between'>
        {displayingRoll && dice.length === 1 && dice[0].displayImage ? (
          <Img src={dice[0].displayImage} />
        ) : (
          <Text variant='h3' sx={{ color: 'secondary.main' }}>
            {displayingRoll ? total : '-'}
          </Text>
        )}
        <Stack direction='row' spacing={2}>
          <Button
            loading={loading}
            color='secondary'
            variant='contained'
            disabled={dice.length === 0 || userLoading}
            onClick={handleRoll}>
            Roll
          </Button>
          <Button disabled={loading} variant='contained' onClick={handleClear}>
            Clear
          </Button>
        </Stack>
      </Stack>

      <Stack
        alignItems='start'
        direction='row'
        width='100%'
        pl={4}
        pr={4}
        sx={{ gap: 2, flexWrap: 'wrap', maxHeight: '60vh', overflow: 'auto' }}>
        {dice.map((die, i) => (
          <Tooltip
            enterTouchDelay={200}
            title={
              <IconButton onClick={() => handleRemove(die.id ?? '')}>
                <Delete />
              </IconButton>
            }
            key={i}>
            <Stack direction='row' spacing={2} alignItems='center' justifyContent='end'>
              <Stack alignItems='center' justifyContent='center'>
                <Stack alignItems='center' justifyContent='center'>
                  <Text>{die.staticValue ? die.staticValue : `${die.label ?? die.type}`}</Text>
                </Stack>

                {!die.staticValue &&
                  (die.displayImage && displayingRoll ? (
                    <Img src={die.displayImage} style={{ height: 20, width: 20 }} />
                  ) : (
                    <Text sx={{ color: 'secondary.main' }}>
                      {die.displayResult === undefined || !displayingRoll ? '-' : die.displayResult}
                    </Text>
                  ))}
              </Stack>

              {i !== dice.length - 1 && <Text>+</Text>}
            </Stack>
          </Tooltip>
        ))}
      </Stack>

      <canvas
        id='threeddice'
        ref={ref}
        style={{
          position: 'fixed',
          top: !desktop ? undefined : 5,
          bottom: !desktop ? 5 : undefined,
          left: 5,
          height: mobile ? '50vh' : tablet ? '70vh' : '95vh',
          width: !desktop ? '95vw' : '70vw',
          maxWidth: 'calc(100vw - 500px)',
        }}></canvas>
    </Panel>
  );
};
