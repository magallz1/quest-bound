import { Input } from '@chakra-ui/react';
import { Campaign } from '@mui/icons-material';
import { useContext } from 'react';
import { useNodeId } from 'reactflow';
import { NodeWrapper } from '../components';
import { LogicContext } from '../provider';

export const AnnounceNode = () => {
  const { getOperation, updateOperation } = useContext(LogicContext);
  const operation = getOperation(useNodeId() ?? '');

  const updateAnnouncementId = (value: string) => {
    if (!operation) return;
    updateOperation({
      id: operation.id,
      data: {
        ...operation.data,
        announcementId: value,
      },
    });
  };

  if (!operation) {
    return null;
  }

  return (
    <NodeWrapper data={operation} ignoreResult>
      <Input
        value={operation.data.announcementId ?? ''}
        size='sm'
        placeholder='Announcement ID'
        onChange={(e) => updateAnnouncementId(e.target.value)}
      />
      <Campaign sx={{ color: !!operation?.value ? '#E66A3C' : 'inherit' }} />
    </NodeWrapper>
  );
};
