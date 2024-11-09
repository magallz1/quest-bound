import {
  Image,
  useCreateCharacter,
  useCurrentUser,
  useOfficialContent,
  usePermittedRulesets,
  useRulesets,
  useSheetTemplates,
} from '@/libs/compass-api';
import { ImageWithUpload } from '@/libs/compass-core-composites';
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedRulesetId?: string;
}

export const CreateCharacter = ({ isOpen, onClose, selectedRulesetId }: Props) => {
  const { createCharacter, loading } = useCreateCharacter();
  const { currentUser } = useCurrentUser();
  const playerRulesets = currentUser?.playtestRulesets ?? [];
  const { rulesets: userRulesets } = useRulesets();
  const { permittedRulesets } = usePermittedRulesets();
  const { rulesets: officialRulesets } = useOfficialContent();

  const rulesets = [...userRulesets, ...permittedRulesets, ...playerRulesets, ...officialRulesets];

  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [image, setImage] = useState<Image | null>(null);
  const [rulesetId, setRulesetId] = useState<string>(selectedRulesetId ?? '');

  const ruleset = rulesets.find((r) => r.id === rulesetId);
  const isPublished = Boolean(ruleset?.published && ruleset?.userId !== currentUser?.id);

  const [sheetId, setSheetId] = useState<string>('');
  const { sheets } = useSheetTemplates(rulesetId, false, isPublished);

  useEffect(() => {
    if (selectedRulesetId) {
      setRulesetId(selectedRulesetId);
    }
  }, [selectedRulesetId]);

  useEffect(() => {
    if (rulesets.length > 0 && !rulesetId && !selectedRulesetId) {
      setRulesetId(rulesets[0].id);
    }
  }, [rulesets]);

  const handleCreate = async () => {
    if (!name || !rulesetId) return;
    const res = await createCharacter({
      name,
      rulesetId,
      imageId: image?.id,
      templateId: sheetId,
      createdFromPublishedRuleset: isPublished,
    });
    onClose();
    navigate(
      `/rulesets/${res.rulesetId}/characters/${res.id}?selected=${!!sheetId ? 'sheet' : 'simple-sheet'}`,
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size='xl'>
      <ModalOverlay />
      <ModalContent sx={{ maxWidth: '90dvw', width: '600px' }}>
        <ModalHeader>Create Character</ModalHeader>
        <Stack padding={2} sx={{ height: '100%', width: '100%' }} spacing={4}>
          <Input placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />

          <ImageWithUpload
            src={image?.src}
            imageStyle={{ height: 200, width: 200 }}
            containerStyle={{ height: 200, width: 200 }}
            onRemove={() => setImage(null)}
            onSelect={setImage}
          />

          <Stack>
            <Text>Select Ruleset</Text>
            <Select onChange={(e) => setRulesetId(e.target.value)} value={rulesetId}>
              {rulesets.map((ruleset) => (
                <option key={ruleset.id} value={ruleset.id}>
                  {ruleset.title}
                </option>
              ))}
            </Select>
          </Stack>

          {sheets?.length > 0 && (
            <Stack>
              <Text>Select Sheet Template</Text>
              <Select onChange={(e) => setSheetId(e.target.value)}>
                <option value={''}>None</option>
                {sheets.map((sheet) => (
                  <option key={sheet.id} value={sheet.id}>
                    {sheet.title}
                  </option>
                ))}
              </Select>
            </Stack>
          )}

          <Button onClick={handleCreate} isLoading={loading} isDisabled={!name || !rulesetId}>
            Create
          </Button>
        </Stack>
      </ModalContent>
    </Modal>
  );
};
