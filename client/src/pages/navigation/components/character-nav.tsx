import { useCharacter } from '@/libs/compass-api';
import { ClientSideLink } from '@/libs/compass-core-composites';
import { Avatar, Button, Skeleton, Stack, Text } from '@/libs/compass-core-ui';
import { Image } from '@mui/icons-material';
import { useParams } from 'react-router-dom';

export const CharacterNav = ({ onClose }: { onClose: () => void }) => {
  const { rulesetId, characterId } = useParams();
  const { character, loading } = useCharacter(characterId);

  if (!character) return null;

  const NavButton = ({
    label,
    path,
    selected,
  }: {
    label: string;
    path?: string;
    selected?: string;
  }) => {
    const route = !!selected
      ? `rulesets/${rulesetId}/characters/${character.id}?selected=${selected}`
      : `rulesets/${rulesetId}/characters/${character.id}/${path}`;

    return (
      <Button
        variant='text'
        color={selected === path ? 'secondary' : 'inherit'}
        sx={{
          flexGrow: '1',
          display: 'flex',
          justifyContent: 'start',
        }}
        onClick={onClose}
        href={route}
        LinkComponent={ClientSideLink}>
        <Text>{label}</Text>
      </Button>
    );
  };

  if (loading) {
    return <Skeleton height={40} width={140} />;
  }

  return (
    <Stack flexGrow={1} spacing={2}>
      <Stack direction='row' spacing={2} alignItems='center' pl={2} pr={2}>
        <Avatar src={character.image?.src ?? ''}>
          <Image />
        </Avatar>
        <Text>{character.name}</Text>
      </Stack>

      <Stack pl={1} pr={1}>
        <NavButton label='Sheet' selected='sheet' />
        <NavButton label='Simple Sheet' selected='simple-sheet' />
      </Stack>
    </Stack>
  );
};
