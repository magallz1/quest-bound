import { Description } from '@/components/description';
import {
  Image,
  UpdateArchetype,
  useArchetype,
  useCreateArchetype,
  useDeleteArchetype,
  useUpdateArchetype,
} from '@/libs/compass-api';
import { ImageWithUpload } from '@/libs/compass-core-composites';
import { Stack } from '@/libs/compass-core-ui';
import { Button, Input } from '@chakra-ui/react';
import debounce from 'lodash.debounce';
import { useEffect, useMemo, useState } from 'react';

interface Props {
  archetypeId?: string;
}

export const ArchetypeForm = ({ archetypeId }: Props) => {
  const { createArchetype, loading } = useCreateArchetype();
  const { deleteArchetype, loading: deleting } = useDeleteArchetype();
  const { updateArchetype } = useUpdateArchetype();

  const { archetype } = useArchetype(archetypeId);

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [image, setImage] = useState<Image | null>(null);
  const [bootstrapped, setBootstrapped] = useState<boolean>(false);

  useEffect(() => {
    if (archetype) {
      setTitle(archetype.title);
      setDescription(archetype.description ?? '');
      setImage(archetype.image ?? null);
      setBootstrapped(true);
    }
  }, [archetype]);

  const handleUpdate = async (update: Omit<UpdateArchetype, 'rulesetId'>) => {
    await updateArchetype({
      id: update.id,
      title: update.title,
      description: update.description,
      imageId: update.imageId,
    });
  };

  const debouncedUpdate = useMemo(() => debounce(handleUpdate, 1000), []);

  useEffect(() => {
    if (archetype) {
      debouncedUpdate({
        id: archetype.id,
        title,
        description,
        imageId: image?.id,
      });
    }
  }, [title, description, image]);

  const handleCreate = async () => {
    await createArchetype({
      title,
      description,
      imageId: image?.id ?? undefined,
    });
  };

  const handleDelete = async () => {
    if (!archetypeId) return;
    await deleteArchetype(archetypeId);
  };
  return (
    <Stack spacing={4}>
      {!archetypeId ? (
        <Button
          onClick={handleCreate}
          isLoading={loading}
          isDisabled={!title}
          style={{ width: '250px' }}>
          Create
        </Button>
      ) : (
        <Button
          onClick={handleDelete}
          isLoading={deleting}
          isDisabled={!title}
          style={{ width: '250px' }}>
          Delete
        </Button>
      )}
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='Title'
        style={{ width: '250px' }}
      />
      <ImageWithUpload
        src={image?.src ?? ''}
        imageStyle={{ height: 150, width: 150 }}
        containerStyle={{ height: 150, width: 150 }}
        onRemove={() => setImage(null)}
        onSelect={(image) => setImage(image)}
      />

      <Description
        id='archetype-description'
        key={`${bootstrapped}`}
        value={description}
        onChange={(description) => setDescription(description)}
        style={{ width: '100%', height: '400px' }}
      />
    </Stack>
  );
};
