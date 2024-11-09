import { Stack, Text, Tooltip } from '@chakra-ui/react';
import { OpenInNew } from '@mui/icons-material';
import { CSSProperties, ReactNode, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNodes } from 'reactflow';
import { CustomHandle } from '../components';
import { IOHandle, operationTypeToIOPlacement } from '../node-data';
import { LogicContext } from '../provider';
import { EvaluationError, OperationType, operationTypeToLabel } from '../types';
import { NodeErrorWrapper } from './node-error-wrapper';

export const NodeWrapper = ({
  data,
  children,
  style,
  ignoreLabel,
  description,
  ignoreResult,
  link,
  manualError,
}: {
  data: { id: string; type: OperationType };
  children: ReactNode;
  style?: CSSProperties;
  ignoreLabel?: boolean;
  description?: string;
  ignoreResult?: boolean;
  link?: string;
  manualError?: EvaluationError;
}) => {
  const { getOperation, showResultsOnNodes } = useContext(LogicContext);
  const operation = getOperation(data.id);
  const navigate = useNavigate();

  const handles = operationTypeToIOPlacement.get(data.type) ?? [];
  const nodes = useNodes();
  const thisNode = nodes.find((node) => node.id === data.id);
  const selected = thisNode?.selected ?? false;

  return (
    <NodeErrorWrapper operationId={operation?.id ?? ''} manualError={manualError}>
      <Stack
        style={style}
        bgColor='#42403D'
        outline={selected ? '2px solid #417090' : '1px solid rgba(250, 247, 242, 0.5)'}
        p={2}
        pl={8}
        pr={8}
        spacing={4}
        direction='column'
        borderRadius={4}
        align='center'
        justify='center'>
        {showResultsOnNodes && !ignoreResult && (
          <Text
            sx={{ position: 'absolute', top: -30, left: 0, textWrap: 'nowrap' }}
            fontSize='1.1rem'>
            {operation?.value ?? ''}
          </Text>
        )}
        {!ignoreLabel && (
          <Stack spacing={2} direction='row' align='center'>
            <Tooltip label={description} aria-label='description' placement='top'>
              <Text>{operationTypeToLabel.get(data.type)}</Text>
            </Tooltip>
            {link && (
              <Tooltip label='Go to resource'>
                <OpenInNew fontSize='small' role='button' onClick={() => navigate(link)} />
              </Tooltip>
            )}
          </Stack>
        )}
        {children}
      </Stack>

      {handles.map((handleProps: IOHandle, i: number) => (
        <CustomHandle
          id={`${data.id}-${handleProps.ioType}`}
          key={`${data.id}-${handleProps.type}-${i}`}
          {...handleProps}
        />
      ))}
    </NodeErrorWrapper>
  );
};
