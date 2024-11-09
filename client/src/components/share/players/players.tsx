import {
  useAddPlaytester,
  useCurrentUser,
  User,
  useRuleset,
  useSearchUsers,
} from '@/libs/compass-api';
import { AutoComplete } from '@/libs/compass-core-ui';
import { useNotifications } from '@/stores';
import { Divider, Input, Stack, Text } from '@chakra-ui/react';
import debounce from 'lodash.debounce';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PlayerOption } from './player-option';
import { PlayersList } from './players-list';

export const Players = () => {
  const { searchUsers, loading: searching } = useSearchUsers();
  const { maxPlayers } = useCurrentUser();

  const { rulesetId } = useParams();
  const { ruleset } = useRuleset(rulesetId);
  const { addPlaytester, loading } = useAddPlaytester();
  const { addNotification } = useNotifications();

  const players = (ruleset?.playtesters ?? []) as User[];

  const maxExceeded = players.length >= maxPlayers;

  const [results, setResults] = useState<User[]>([]);

  const filtedResults = results.filter((res) => !players.find((pt) => pt.id === res.id));

  const options = filtedResults.map((r) => ({
    label: r.username,
    value: r.id,
  }));

  const userSearch = async (username: string) => {
    const res = await searchUsers({ input: { username } });
    setResults(res);
  };

  const handleAdd = async (user: User) => {
    setResults([]);

    const res = await addPlaytester(user.id);

    if (res) {
      addNotification({
        message: `Added ${user.username} to play testers`,
        status: 'success',
      });
    }
  };

  const debouncedSearch = debounce(userSearch, 500);
  return (
    <Stack>
      <AutoComplete
        loading={searching}
        sx={{ width: '100%' }}
        loadingText='Searching...'
        noOptionsText='No users found'
        onInputChange={(_, value) => debouncedSearch(value)}
        options={options}
        renderInput={(params) => (
          <div ref={params.InputProps.ref}>
            <Input
              {...params.inputProps}
              size='sm'
              placeholder='Search by username'
              isDisabled={maxExceeded}
            />
          </div>
        )}
        renderOption={(_, option) => (
          <PlayerOption key={option.value} option={option} results={results} onSelect={handleAdd} />
        )}
      />

      <Divider sx={{ mb: 2 }} />

      {maxExceeded && (
        <Text fontSize='0.9rem' fontStyle='italic'>
          Maximum number of players added
        </Text>
      )}

      <PlayersList players={players} loading={loading} />
    </Stack>
  );
};
