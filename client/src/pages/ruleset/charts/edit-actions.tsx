import { Chart, FileResponse, useUpdateChart } from '@/libs/compass-api';
import { FileUpload } from '@/libs/compass-core-composites';
import { Modal } from '@/libs/compass-core-ui';
import { useNotifications } from '@/stores';
import { Button, Stack } from '@chakra-ui/react';
import { Download, Upload } from '@mui/icons-material';
import { useState } from 'react';

interface EditActionsProps {
  chart: Chart;
}

export const EditActions = ({ chart }: EditActionsProps) => {
  const [fileUploadOpen, setFileUploadOpen] = useState(false);
  const { updateChart } = useUpdateChart();
  const { addNotification } = useNotifications();

  const onComplete = async (newFileKeys: FileResponse[]) => {
    const newFileKey = newFileKeys[0].fileKey;

    await updateChart({
      id: chart.id,
      fileKey: newFileKey,
    });

    setFileUploadOpen(false);
  };

  const handleExport = () => {
    const { data } = chart;

    if (!data) {
      addNotification({ status: 'error', message: 'No chart data found' });
      return;
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + data.map((e) => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);

    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${chart.title}.csv`);
    document.body.appendChild(link);

    link.click();

    document.removeChild(link);
  };

  return (
    <>
      <Stack direction='row' spacing={2}>
        <Button variant='ghost' rightIcon={<Upload />} onClick={() => setFileUploadOpen(true)}>
          Import
        </Button>
        <Button variant='ghost' rightIcon={<Download />} onClick={handleExport}>
          Export
        </Button>
      </Stack>
      <Modal open={fileUploadOpen} onClose={() => setFileUploadOpen(false)}>
        <FileUpload
          convertToJson
          bucketName='charts'
          allowedFileTypes={['.csv']}
          maxNumberOfFiles={1}
          onComplete={onComplete}
        />
      </Modal>
    </>
  );
};
