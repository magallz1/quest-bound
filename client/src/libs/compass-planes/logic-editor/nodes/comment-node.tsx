import { Box, Textarea } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { useNodeId, useNodes } from 'reactflow';
import { LogicContext } from '../provider';
import { LogicalValue } from '../types';

export const CommentNode = () => {
  const { getOperation, updateOperation } = useContext(LogicContext);
  const operation = getOperation(useNodeId() ?? '');
  if (!operation) return null;

  const nodes = useNodes();
  const thisNode = nodes.find((node) => node.id === operation.id);
  const isSelected = thisNode?.selected ?? false;

  const [value, setValue] = useState<LogicalValue>(operation.value ?? '');

  const handleChange = (value: string | number) => {
    setValue(value);
    updateOperation({
      id: operation.id,
      value,
    });
  };

  return (
    <Box
      bgColor='rgba(65, 112, 144, 0.5)'
      padding={3}
      outline={isSelected ? '2px solid #417090' : '1px solid rgba(250, 247, 242, 0.5)'}
      sx={{ color: '#FAF7F2' }}>
      <div style={{ height: '25px', width: '100%' }} />
      <Textarea value={value} onChange={(e) => handleChange(e.target.value)} className='nodrag' />
    </Box>
  );
};
