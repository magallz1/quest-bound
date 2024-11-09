import { FileResponse, Image, useImages } from '@/libs/compass-api';
import { Button, Input, Stack, Text } from '@/libs/compass-core-ui';
import { toBase64 } from '@/libs/compass-web-utils';
import { Modal, ModalContent, ModalOverlay } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { FileUpload } from '../file-upload';

interface SelectImageModalProps {
  onSelect?: (image: Image) => void;
  onSaveUrl: (url: string) => void;
  onRemoveUrl: () => void;
  open: boolean;
  onClose: () => void;
  loading?: boolean;
}

/**
 * Lets user select an image from OS. If an image with that name already exists, it will be selected.
 * Otherwise, opens the file upload UI to upload and create the image.
 */
export const SelectImageModal = ({
  onSelect,
  onSaveUrl,
  onRemoveUrl,
  open,
  onClose,
  loading,
}: SelectImageModalProps) => {
  const { images, createImages } = useImages();
  const [url, setUrl] = useState<string>('');
  const fileRef = useRef<HTMLInputElement>(null);

  const [fileUpload, setFileUpload] = useState<File | null>(null);

  const handleSelect = async () => {
    const files = fileRef?.current?.files;
    const file = files?.[0];
    if (!file) return;

    const base64 = await toBase64(file);
    const existingImage = images.find(
      (image) => JSON.parse(image.details) === base64.slice(0, 1000),
    );

    if (existingImage) {
      onSelect?.(existingImage);
      onClose();
    } else {
      setFileUpload(file);
    }
  };

  const handleClose = () => {
    setUrl('');
    onClose();
  };

  const onComplete = async (files: FileResponse[]) => {
    const file = files?.[0];
    if (!file) return;

    const base64 = await toBase64(file.file);

    const updatedImages = await createImages([file]);
    const existingImage = updatedImages.find(
      (image) => JSON.parse(image.details) === base64.slice(0, 1000),
    );

    if (existingImage) onSelect?.(existingImage);
    setFileUpload(null);
    onClose();
  };

  return (
    <>
      <Modal isOpen={open} onClose={handleClose} isCentered size='sm'>
        <ModalOverlay />
        <ModalContent sx={{ maxWidth: '90dvw', width: '300px' }}>
          <Stack spacing={2} padding={2}>
            <Button color='info' onClick={() => fileRef?.current?.click()}>
              Select
            </Button>

            <input
              ref={fileRef}
              accept='image/*'
              type='file'
              style={{ display: 'none' }}
              onChange={handleSelect}
            />

            <Stack width='100%' alignItems='center'>
              <Text variant='subtitle1'>-or-</Text>
            </Stack>

            <Input
              id='image-url'
              label='Enter image URL'
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              ignoreHelperText
            />

            <Stack
              direction='row'
              onClick={(e) => e.stopPropagation()}
              width='100%'
              spacing={2}
              justifyContent='end'>
              {!!onRemoveUrl && (
                <Button
                  color='error'
                  variant='contained'
                  onClick={() => {
                    onRemoveUrl();
                    handleClose();
                  }}>
                  Remove
                </Button>
              )}

              <Button
                variant='contained'
                color='secondary'
                loading={loading}
                disabled={url.length === 0}
                onClick={() => {
                  onSaveUrl(url);
                  setUrl('');
                }}>
                Save
              </Button>
            </Stack>
          </Stack>
        </ModalContent>
      </Modal>
      <Modal isOpen={!!fileUpload} onClose={() => setFileUpload(null)} isCentered>
        <ModalOverlay />
        <ModalContent sx={{ maxWidth: '90dvw', width: '600px' }}>
          <FileUpload
            bucketName='images'
            allowedFileTypes={['image/*']}
            fileToAdd={fileUpload}
            onComplete={onComplete}
            maxNumberOfFiles={1}
          />
        </ModalContent>
      </Modal>
    </>
  );
};
