import { FrameComponentData, SheetComponent } from '@/libs/compass-api';
import { Stack } from '@chakra-ui/react';
import { Laptop } from '@mui/icons-material';
import { CSSProperties } from 'react';
import { useNodeId } from 'reactflow';
import ResizableNodeWrapper from '../../common/components/resizable-node-wrapper';
import { useEditorStore } from '../editor-store';
import { useNodeSize, useSubscribeComponentChanges } from '../hooks';
import { getBorderStyles } from '../utils';

export const FrameNode = () => {
  const getComponent = useEditorStore((state) => state.getComponent);
  const id = useNodeId();

  const component = getComponent(id);

  const { height, width } = useNodeSize(component?.id ?? '');

  const key = useSubscribeComponentChanges(id);

  if (!component) return null;

  return (
    <ResizableNodeWrapper component={component} key={key}>
      <PrimitiveFrameNode
        component={{ ...component, height: parseFloat(height), width: parseFloat(width) }}
      />
    </ResizableNodeWrapper>
  );
};

export const PrimitiveFrameNode = ({ component }: { component: SheetComponent }) => {
  const css = JSON.parse(component.style) as CSSProperties;
  const data = JSON.parse(component.data) as FrameComponentData;
  const url = data.url;

  const height = `${component.height}px`;
  const width = `${component.width}px`;

  return (
    <Stack
      alignItems='center'
      justifyContent='center'
      style={{
        height,
        width,
        color: 'common.white',
        opacity: css.opacity,
        backgroundColor: css.backgroundColor,
        ...getBorderStyles(css),
      }}>
      {component.locked && !!data.url ? (
        <iframe
          id={`component-${component.id}-iframe`}
          height={component.height}
          width={component.width}
          src={url}
          sandbox='allow-same-origin allow-scripts allow-presentation'
          style={{
            ...getBorderStyles(css),
          }}
        />
      ) : (
        <Laptop />
      )}
    </Stack>
  );
};
