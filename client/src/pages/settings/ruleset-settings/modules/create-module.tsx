import { Button, Modal } from '@/libs/compass-core-ui';
import { useState } from 'react';

export const CreateModule = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <>
      <Button onClick={() => setModalOpen(true)} color='info'>
        Create Module
      </Button>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        size='medium'
        title='Create Module'></Modal>
    </>
  );
};
