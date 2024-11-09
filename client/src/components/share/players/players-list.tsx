import { User, useRemovePlaytester, useRuleset } from '@/libs/compass-api';
import {
  Button,
  Center,
  IconButton,
  Image,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  Progress,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Delete, Person } from '@mui/icons-material';
import { useParams } from 'react-router-dom';

interface Props {
  players: User[];
  loading?: boolean;
}

export const PlayersList = ({ players, loading }: Props) => {
  const { rulesetId } = useParams();
  const { ruleset, loading: rulesetLoading } = useRuleset(rulesetId);
  const { removePlaytester, loading: removing } = useRemovePlaytester();

  const sortedPlayers = [...players].sort((a, b) => a.username.localeCompare(b.username));

  const handleRemove = async (id: string) => {
    if (!rulesetId) return;
    await removePlaytester(id);
  };

  return (
    <>
      <Stack spacing={2}>
        {sortedPlayers.length === 0 && !(loading || rulesetLoading) ? (
          <Text fontSize='0.9rem' fontStyle='italic'>
            No players have been added to this ruleset
          </Text>
        ) : (
          <Stack sx={{ flexGrow: 1, maxHeight: '60dvh', overflowY: 'auto' }}>
            {(loading || rulesetLoading) && <Progress isIndeterminate size='sm' />}

            {sortedPlayers.map((pt) => (
              <Stack
                key={pt.username}
                direction='row'
                width='100%'
                sx={{ height: '60px' }}
                justifyContent='space-between'
                align='center'>
                <Stack direction='row' spacing={2} alignItems='center'>
                  <Image
                    src={pt.avatarSrc ?? undefined}
                    boxSize='50px'
                    fallback={
                      <Center>
                        <Person />
                      </Center>
                    }
                  />
                  <Stack pt={1} pb={1} spacing={0}>
                    <Text>{pt.username}</Text>
                    <Text fontSize='0.9rem'>{pt.email}</Text>
                  </Stack>
                </Stack>

                <Popover>
                  <PopoverTrigger>
                    <IconButton variant='ghost' aria-label='Delete'>
                      <Delete />
                    </IconButton>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverBody>
                      <Stack spacing={1}>
                        <Text>{`${pt.username} will no longer be able to play test this ruleset.`}</Text>
                        <Text>{`This will delete all of ${pt.username}'s ${
                          ruleset?.title ?? ''
                        } characters.`}</Text>
                      </Stack>
                    </PopoverBody>
                    <PopoverFooter>
                      <Button onClick={() => handleRemove(pt.id)} isLoading={removing}>
                        Remove
                      </Button>
                    </PopoverFooter>
                  </PopoverContent>
                </Popover>
              </Stack>
            ))}
          </Stack>
        )}
      </Stack>
    </>
  );
};
