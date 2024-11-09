import { User } from '@/libs/compass-api';
import { AutoCompleteOption } from '@/libs/compass-core-ui';
import { Center, Image, Stack, Text } from '@chakra-ui/react';
import { Person } from '@mui/icons-material';

interface Props {
  option: AutoCompleteOption;
  results: User[];
  onSelect: (user: User) => void;
}

export const PlayerOption = ({ option, results, onSelect }: Props) => {
  if (!option) return null;

  const optionUser = results.find((user) => user.id === option.value);

  if (!optionUser) return null;

  return (
    <Stack>
      <Stack
        className='clickable'
        onClick={() => onSelect(optionUser)}
        width='100%'
        padding={2}
        key={optionUser.id}
        direction='row'
        spacing={4}
        alignItems='center'>
        <Image
          src={optionUser.avatarSrc ?? undefined}
          style={{ height: 40, width: 40 }}
          fallback={
            <Center>
              <Person />
            </Center>
          }
        />
        <Text>{optionUser.username}</Text>
      </Stack>
    </Stack>
  );
};
