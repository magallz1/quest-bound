import { CreateChart, FileResponse, useCreateChart, useDeleteFile } from '@/libs/compass-api';
import { FileUpload } from '@/libs/compass-core-composites';
import { Confirm } from '@/libs/compass-core-ui';
import { useNotifications } from '@/stores';
import { Button, Checkbox, Input, Modal, ModalContent, Stack, Text } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
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

function cleanFileName(name: string) {
  return name
    .replace(/_/g, '-')
    .replace(/.csv/g, '')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export const QuickChart = ({ onCreate }: { onCreate?: () => void }) => {
  const { rulesetId } = useParams();
  const { addNotification } = useNotifications();
  const { createChart, createCharts, loading } = useCreateChart(rulesetId);
  const { deleteFile } = useDeleteFile();
  const [fileModalOpen, setFileModalOpen] = useState<boolean>(false);
  const [fileUploadResults, setFileUploadResults] = useState<FileResponse[]>([]);
  const [cleanUpFileNames, setCleanUpFileNames] = useState<boolean>(false);
  const [multiLoading, setMultiLoading] = useState<boolean>(false);

  const formik = useFormik<FormValues>({
    initialValues: {
      title: '',
      fileName: '',
      fileKey: '',
    },
    validationSchema,
    onSubmit: (values) => {
      handleCreateChart(values);
    },
  });

  const handleCreateChart = async (values: FormValues) => {
    if (!rulesetId) return;
    await createChart({
      rulesetId,
      title: values.title,
      fileKey: values.fileKey,
    });

    onCreate?.();
    addNotification({
      message: 'Chart created successfully',
    });
    setFileUploadResults([]);
  };

  const handleClearFiles = () => {
    fileUploadResults.forEach((file) => {
      deleteFile({
        bucketName: 'charts',
        fileName: file.fileKey,
      });
    });

    formik.setValues({ ...formik.values, fileName: '' });
    setFileUploadResults([]);
  };

  const handleMuliCreate = async () => {
    try {
      setMultiLoading(true);
      const requests: CreateChart[] = fileUploadResults.map((file) => ({
        rulesetId: rulesetId ?? '',
        title: cleanUpFileNames ? cleanFileName(file.fileName) : file.fileName,
        fileKey: file.fileKey,
      }));

      await createCharts(requests);
      onCreate?.();
      addNotification({
        message: 'Charts created successfully',
        status: 'success',
      });
      setFileUploadResults([]);
    } catch (e) {
      setMultiLoading(false);
    }
  };

  const handleClose = () => {
    if (formik.values.fileKey) {
      handleClearFiles();
    }

    formik.resetForm();
    setFileModalOpen(false);
  };

  return (
    <>
      <Stack spacing={6}>
        <Stack direction='row' spacing={4} flexWrap='wrap'>
          <Button
            isDisabled={!formik.values.fileName || !formik.values.title}
            isLoading={loading}
            onClick={formik.submitForm}>
            Create
          </Button>

          {formik.values.fileName ? (
            <Button onClick={handleClearFiles}>Remove File</Button>
          ) : (
            <Button onClick={() => setFileModalOpen(true)}>Upload .CSV File</Button>
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
            {formik.errors.fileKey && (
              <Text sx={{ fontSize: '0.8rem' }} color='error'>
                {formik.errors.fileKey}
              </Text>
            )}
          </>
        ) : (
          <Text fontSize='0.9rem' fontStyle='italic'>
            Select multiple files to create multiple charts
          </Text>
        )}
      </Stack>

      <Modal isOpen={fileModalOpen} onClose={handleClose} isCentered size='xl'>
        <ModalContent>
          <FileUpload
            convertToJson
            bucketName='charts'
            allowedFileTypes={['.csv']}
            onComplete={(results) => {
              setFileUploadResults(results);

              if (results.length === 1) {
                formik.setValues({
                  ...formik.values,
                  fileName: results[0].fileName,
                  fileKey: results[0].fileKey,
                });
              }

              setFileModalOpen(false);
            }}
          />
        </ModalContent>
      </Modal>

      <Confirm
        title={`Create ${fileUploadResults.length} charts?`}
        loading={multiLoading}
        open={fileUploadResults.length > 1}
        onClose={handleClearFiles}
        onConfirm={handleMuliCreate}>
        <Stack spacing={1}>
          <Checkbox
            isChecked={cleanUpFileNames}
            onChange={(e) => setCleanUpFileNames(e.target.checked)}>
            Clean up file names
          </Checkbox>
          <Text fontSize='0.9rem' fontStyle='italic'>{`bard-spells => Bard Spells`}</Text>
        </Stack>
      </Confirm>
    </>
  );
};
