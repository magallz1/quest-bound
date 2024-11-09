import { Image, useCreateRuleset } from '@/libs/compass-api';
import { ImageWithUpload } from '@/libs/compass-core-composites';
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateRuleset = ({ isOpen, onClose }: Props) => {
  const { createRuleset, loading } = useCreateRuleset();

  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [image, setImage] = useState<Image | null>(null);

  const handleCreate = async () => {
    const res = await createRuleset({ title, imageId: image?.id });
    onClose();
    navigate(`/rulesets/${res.id}/attributes`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size='xl'>
      <ModalOverlay />
      <ModalContent sx={{ width: '600px', maxWidth: '90dvw' }}>
        <ModalHeader>Create Ruleset</ModalHeader>
        <Stack padding={2} sx={{ height: '100%', width: '100%' }} spacing={4}>
          <Input placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} />

          <ImageWithUpload
            src={image?.src}
            imageStyle={{ height: 200, width: 200 }}
            containerStyle={{ height: 200, width: 200 }}
            onRemove={() => setImage(null)}
            onSelect={setImage}
          />

          <Button onClick={handleCreate} isLoading={loading} isDisabled={!title}>
            Create
          </Button>
        </Stack>
      </ModalContent>
    </Modal>
  );
};
