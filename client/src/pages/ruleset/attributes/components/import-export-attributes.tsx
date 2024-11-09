import { AttributeType, useGetAttributes, useImportAttributes } from '@/libs/compass-api';
import { FileUpload } from '@/libs/compass-core-composites';
import { useNotifications } from '@/stores';
import { Button, Modal, ModalContent, Stack } from '@chakra-ui/react';
import { Download, Upload } from '@mui/icons-material';
import { useState } from 'react';

interface Props {
  type?: AttributeType;
}

export const ImportExportAttributes = ({ type }: Props) => {
  const { addNotification } = useNotifications();

  const { importAttributes, loading: importLoading } = useImportAttributes({ type });

  const { getAttributes, loading } = useGetAttributes({
    fetchLogic: true,
    type,
  });

  const [fileModalOpen, setFileModalOpen] = useState<boolean>(false);

  const handleExport = async () => {
    const attributes = await getAttributes({ fetchPolicy: 'no-cache' });

    if (!attributes) {
      addNotification({ status: 'error', message: 'Error exporting attributes' });
      return;
    }

    const parsedAttributes = attributes.map((a) => ({
      id: a.id,
      name: a.name,
      type: a.type,
      defaultValue: a.defaultValue,
      description: a.description ?? '',
      category: a.category ?? '',
      restraints: JSON.stringify(a.restraints),
      logic: a.logic,
    }));

    const csvData = [
      ['id', 'name', 'type', 'defaultValue', 'description', 'category', 'restraints', 'logic'],
    ];

    parsedAttributes.forEach((a) => {
      csvData.push([
        a.id,
        a.name,
        a.type,
        a.defaultValue,
        a.description,
        a.category,
        a.restraints,
        a.logic,
      ]);
    });

    const csvContent =
      'data:text/tab-separated-values;charset=utf-8,' +
      csvData.map((row) => row.join('\t')).join('\n');

    const encodedUri = encodeURI(csvContent);

    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${type ? type.toLowerCase() : 'attributes'}.tsv`);
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  const handleImport = async (fileKey: string) => {
    await importAttributes({ fileKey });
  };

  return (
    <>
      <Stack direction='row' spacing={1}>
        <Button
          variant='ghost'
          rightIcon={<Upload />}
          isLoading={importLoading}
          onClick={() => setFileModalOpen(true)}>
          Import
        </Button>
        <Button variant='ghost' rightIcon={<Download />} isLoading={loading} onClick={handleExport}>
          Export
        </Button>
      </Stack>
      <Modal
        isOpen={fileModalOpen}
        onClose={() => {
          setFileModalOpen(false);
        }}
        isCentered
        size='xl'>
        <ModalContent>
          <FileUpload
            bucketName='charts'
            allowedFileTypes={['.tsv']}
            onComplete={(results) => {
              if (results.length === 1) {
                handleImport(results[0].fileKey);
              }

              setFileModalOpen(false);
            }}
          />
        </ModalContent>
      </Modal>
    </>
  );
};
