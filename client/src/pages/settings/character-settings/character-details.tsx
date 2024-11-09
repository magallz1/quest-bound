import {
  Character,
  Image,
  useCharacter,
  useDeleteCharacter,
  useUpdateCharacter,
} from '@/libs/compass-api';
import { ImageWithUpload } from '@/libs/compass-core-composites';
import { Confirm, DeleteButton } from '@/libs/compass-core-ui';
import { SettingsContext } from '@/libs/compass-web-utils';
import {
  Button,
  Divider,
  Editable,
  EditableInput,
  EditablePreview,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { SelectCharacterSheetTemplate } from './select-character-sheet-template';

export type FormValues = {
  name: string;
};

export const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
});

export const CharacterDetails = () => {
  const { characterId } = useParams();
  const { character } = useCharacter(characterId);
  const { openSettingsModal, setSettingsPage } = useContext(SettingsContext);
  const { updateCharacter, loading } = useUpdateCharacter();
  const { deleteCharacter, loading: deleting } = useDeleteCharacter();

  const navigate = useNavigate();
  const [confirmReset, setConfirmReset] = useState(false);
  const [imageLoading, setImageLoading] = useState<boolean>(false);

  const handleUpdate = async (values: Partial<Character>) => {
    if (!character) return;
    await updateCharacter({
      id: character.id,
      ...values,
    });
  };

  const handleDelete = async () => {
    if (!character) return;
    await deleteCharacter(character.id);
    setSettingsPage('profile');
    openSettingsModal(false);
    navigate('/');
  };

  const handleImageSave = async (image: Image | null) => {
    if (!character) return;
    setImageLoading(true);
    await updateCharacter({
      id: character.id,
      imageId: image?.id ?? null,
    });
    setImageLoading(false);
  };

  const handleReset = async () => {
    if (!character) return;
    await updateCharacter(
      {
        id: character.id,
        templateId: character.sheet?.templateId,
      },
      {},
      true,
    );

    setConfirmReset(false);
  };

  if (!character) return null;

  return (
    <>
      <Stack padding={2} spacing={4} sx={{ height: '100%', overflowY: 'auto' }}>
        <Stack spacing={1}>
          <Text sx={{ opacity: 0.7 }}>Character Settings</Text>
          <Divider />
        </Stack>
        <Stack direction='row' spacing={2} flexWrap='wrap'>
          <Button
            onClick={() => setConfirmReset(true)}
            isLoading={loading}
            isDisabled={!character?.sheet?.templateId}>
            Reset Template
          </Button>
          <DeleteButton
            loading={deleting}
            title={`Delete ${character.name}?`}
            onDelete={handleDelete}
          />
        </Stack>

        <Editable
          defaultValue={character?.name}
          onSubmit={(name) => handleUpdate({ name })}
          fontSize='1.5rem'>
          <EditablePreview />
          <EditableInput />
        </Editable>
        <ImageWithUpload
          src={character.image?.src}
          loading={imageLoading}
          onRemove={() => handleImageSave(null)}
          onSelect={handleImageSave}
          containerStyle={{ width: 150, height: 150 }}
          imageStyle={{ width: 150, height: 150 }}
        />

        <SelectCharacterSheetTemplate />
      </Stack>
      <Confirm
        title='Reset sheet to its current template?'
        open={confirmReset}
        loading={loading}
        onClose={() => setConfirmReset(false)}
        onConfirm={handleReset}>
        <Text>Any edits you've made to this sheet will be removed.</Text>
        <Text>All character attribute values will remain.</Text>
      </Confirm>
    </>
  );
};
