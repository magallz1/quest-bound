import { LineComponentData } from '@/libs/compass-api';
import { Box } from '@chakra-ui/react';
import { useNodeId, useViewport } from 'reactflow';
import ResizableNodeWrapper from '../../../common/components/resizable-node-wrapper';
import { useEditorStore } from '../../editor-store';
import { useConditionalRender, useSubscribeComponentChanges } from '../../hooks';
import { RenderSegment } from './render-segment';

export const LineNode = () => {
  const getComponent = useEditorStore((state) => state.getComponent);
  const selectedComponentIds = useEditorStore((state) => state.selectedComponentIds);
  const viewMode = useEditorStore((state) => state.viewMode);

  const isSelected = (id: string) => selectedComponentIds.includes(id);

  const id = useNodeId();

  const key = useSubscribeComponentChanges(id);

  const component = getComponent(id);
  const { y } = useViewport();

  const { shouldRender } = useConditionalRender(component ?? undefined);

  if (!component) return null;

  const selected = isSelected(component.id);
  const locked = component.locked;

  const data = JSON.parse(component.data) as LineComponentData;

  return (
    <>
      <ResizableNodeWrapper component={component} disabled key={key}>
        {!viewMode && (
          <Box
            sx={{
              height: '5px',
              width: '5px',
              borderRadius: '50%',
              backgroundColor: data.strokeColor,
              position: 'absolute',
              left: '-2.5px',
              top: '-2.5px',
              outlineColor: locked && selected ? '#E66A3C' : selected ? '#417090' : undefined,
              outlineWidth: selected ? '2px' : '0px',
              outlineOffset: '2px',
              outlineStyle: 'solid',
              zIndex: component.layer,
            }}
          />
        )}
      </ResizableNodeWrapper>
      {shouldRender && <RenderSegment componentId={component.id} y={y} />}
    </>
  );
};
