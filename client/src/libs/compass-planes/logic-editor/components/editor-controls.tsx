import { useDeviceSize } from '@/libs/compass-core-ui';
import { IconButton, Stack, Text } from '@chakra-ui/react';
import { Add, Close, ContentCopy, Delete, Grid4x4, Lightbulb } from '@mui/icons-material';
import React from 'react';
import { Link } from 'react-router-dom';
import { Panel, useNodes } from 'reactflow';

interface EditorControlsProps {
  setSnapToGrid: React.Dispatch<React.SetStateAction<boolean>>;
  setShowResultsOnNodes: React.Dispatch<React.SetStateAction<boolean>>;
  duplicate: () => void;
  showResultsOnNodes: boolean;
  snapToGrid: boolean;
  onOpenMenu: () => void;
  onDelete: (ids: string[]) => void;
  attributeName: string;
  onCloseEditor: () => void;
}

export const EditorControls = ({
  attributeName,
  setSnapToGrid,
  setShowResultsOnNodes,
  duplicate,
  showResultsOnNodes,
  snapToGrid,
  onOpenMenu,
  onDelete,
  onCloseEditor,
}: EditorControlsProps) => {
  const nodes = useNodes();
  const selectedIds = nodes.filter((node) => node.selected).map((node) => node.id);
  const nodesAreSelected = selectedIds.length > 0;
  const { desktop } = useDeviceSize();

  return (
    <Panel position='top-left'>
      <Stack spacing={2}>
        <Text>{`Logic of ${attributeName}`}</Text>
        <Stack direction='row' spacing={2} align='center'>
          <IconButton
            title='Close logic editor'
            aria-label='toggle show logic editor'
            onClick={onCloseEditor}>
            <Close fontSize='small' />
          </IconButton>
          <IconButton
            title='Show node values'
            aria-label='toggle show node values'
            onClick={() => setShowResultsOnNodes((prev) => !prev)}>
            <Lightbulb
              fontSize='small'
              sx={{ color: showResultsOnNodes ? '#E66A3C' : 'inherit' }}
            />
          </IconButton>
          <IconButton
            title='Snap to grid'
            aria-label='toggle snap to grid'
            onClick={() => setSnapToGrid((prev) => !prev)}>
            <Grid4x4 fontSize='small' sx={{ color: snapToGrid ? '#E66A3C' : 'inherit' }} />
          </IconButton>

          {!desktop && (
            <IconButton title='Create node' aria-label='create node' onClick={onOpenMenu}>
              <Add fontSize='small' />
            </IconButton>
          )}

          {nodesAreSelected && (
            <>
              <IconButton
                aria-label='Duplicate selected nodes'
                title='Duplicate selected nodes'
                onClick={duplicate}>
                <ContentCopy fontSize='small' />
              </IconButton>

              <IconButton
                aria-label='Delete selected nodes'
                title='Delete selected nodes'
                onClick={() => onDelete(selectedIds)}>
                <Delete fontSize='small' />
              </IconButton>
            </>
          )}
        </Stack>
        {nodes.length === 0 && (
          <>
            {desktop && <Text style={{ userSelect: 'none' }}>Right click to place a new node</Text>}

            <Stack direction='row'>
              <Text fontSize='0.9rem' fontStyle='italic' style={{ userSelect: 'none' }}>
                New to logic?
              </Text>
              <Link
                to='https://www.youtube.com/watch?v=0F6E6RXgZRg'
                target='_blank'
                style={{
                  fontSize: '0.9rem',
                  fontStyle: 'italic',
                  textDecoration: 'underline',
                }}>
                Watch this demo
              </Link>
            </Stack>
          </>
        )}
      </Stack>
    </Panel>
  );
};
