import { useCreateDocument, useDeleteFile } from '@/libs/compass-api';
import { FileUpload } from '@/libs/compass-core-composites';
import { useNotifications } from '@/stores';
import { Button, Input, Modal, ModalContent, Stack, Text } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as yup from 'yup';

type FormValues = {
  title: string;
  fileName: string;
  fileKey: string;
};

export const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  fileKey: yup.string().required('File is required'),
});

export const QuickDocument = ({ onCreate }: { onCreate?: () => void }) => {
  const { createDocument, loading } = useCreateDocument();
  const { deleteFile } = useDeleteFile();
  const { addNotification } = useNotifications();
  const [fileModalOpen, setFileModalOpen] = useState<boolean>(false);

  const formik = useFormik<FormValues>({
    initialValues: {
      title: '',
      fileName: '',
      fileKey: '',
    },
    validationSchema,
    onSubmit: (values) => {
      handleCreateDocument(values);
    },
  });

  const handleCreateDocument = async (values: FormValues) => {
    await createDocument({
      title: values.title,
      fileKey: values.fileKey,
    });

    onCreate?.();
    addNotification({
      message: 'Document created successfully',
    });
  };

  const handleClearFile = () => {
    deleteFile({
      bucketName: 'documents',
      fileName: formik.values.fileKey,
    });

    formik.setValues({ ...formik.values, fileName: '' });
  };

  const handleClose = () => {
    if (formik.values.fileKey) {
      handleClearFile();
    }

    formik.resetForm();
    setFileModalOpen(false);
  };

  return (
    <>
      <Stack spacing={6}>
        <Stack direction='row' spacing={4} flexWrap='wrap'>
          <Button
            onClick={formik.submitForm}
            isLoading={loading}
            isDisabled={!formik.values.fileName || !formik.values.title}>
            Create
          </Button>
          {formik.values.fileName ? (
            <Button onClick={handleClearFile}>Remove File</Button>
          ) : (
            <Button onClick={() => setFileModalOpen(true)}>Upload PDF File</Button>
          )}
        </Stack>

        <Input
          placeholder='Title'
          value={formik.values.title}
          onChange={(e) => formik.setFieldValue('title', e.target.value)}
        />
        {formik.values.fileName ? (
          <>
            <Text sx={{ fontSize: '0.8rem' }}>{formik.values.fileName}</Text>
          </>
        ) : (
          <>
            {formik.errors.fileKey && (
              <Text sx={{ fontSize: '0.8rem' }} color='error'>
                {formik.errors.fileKey}
              </Text>
            )}
          </>
        )}
      </Stack>

      <Modal isOpen={fileModalOpen} onClose={handleClose} size='xl' isCentered>
        <ModalContent>
          <FileUpload
            bucketName='documents'
            allowedFileTypes={['.pdf']}
            maxNumberOfFiles={1}
            onComplete={(results) => {
              formik.setValues({
                ...formik.values,
                fileName: results[0].fileName,
                fileKey: results[0].fileKey,
              });
              setFileModalOpen(false);
            }}
          />
        </ModalContent>
      </Modal>
    </>
  );
};
