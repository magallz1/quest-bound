import { Modal, Stack, Text } from '@/libs/compass-core-ui';
import { useState } from 'react';
import { Description } from './description';

interface Props {
  value: string;
  title: string;
}

export const DescriptionModal = ({ value, title }: Props) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <>
      <Text
        sx={{ textDecoration: 'underline' }}
        component='span'
        className='clickable'
        onClick={() => setModalOpen(true)}>
        Description
      </Text>
      <Modal title={title} open={modalOpen} onClose={() => setModalOpen(false)}>
        <Stack height={300} width={450}>
          <Description readOnly value={value} />
        </Stack>
      </Modal>
    </>
  );
};
