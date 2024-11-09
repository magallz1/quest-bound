import { componentTypes, SheetComponent } from '@/libs/compass-api';
import { useKeyListeners } from '@/libs/compass-web-utils';
import { useState } from 'react';
import { NodeResizer, useReactFlow } from 'reactflow';
import { useEditorStore } from '../editor-store';
import { useComponentClickActions, useConditionalRender } from '../hooks';
import { useRenderAnnouncement } from '../hooks/use-render-announcement';

type OverrideProps = {
  height?: number;
  width?: number;
  rotation?: number;
  locked?: boolean;
  streamMode?: boolean;
};

interface ResizableNodeSelectedProps {
  children: React.ReactNode;
  component?: SheetComponent;
  disabled?: boolean;
  props?: OverrideProps;
  className?: string;
}

const ResizableNodeSelected = ({
  children,
  component,
  disabled = false,
  props,
  className,
}: ResizableNodeSelectedProps) => {
  const reactFlow = useReactFlow();
  const nodes = reactFlow.getNodes();
  const data = JSON.parse(component?.data ?? '{}');
  const selected = nodes.some((node) => node.id === component?.id && node.selected) || false;

  const { streamMode, viewMode } = useEditorStore();

  const [keepAspectRatio, setKeepAspectRatio] = useState<boolean>(false);

  const { shouldRender } = useConditionalRender(component);
  const { shouldRender: shouldRenderAnnouncement } = useRenderAnnouncement(component);

  const { onClick, clickable } = useComponentClickActions({ data, disabled: !viewMode });

  useKeyListeners({
    onKeyDown: (e) => {
      if (e.key === 'Shift') {
        setKeepAspectRatio(true);
      }
    },
    onKeyUp: (e) => {
      if (e.key === 'Shift') {
        setKeepAspectRatio(false);
      }
    },
  });

  if (!shouldRender || !shouldRenderAnnouncement) return null;

  const componentType = componentTypes.find(
    (componentType) => componentType.type === component?.type,
  );

  return (
    <div
      className={`${component?.locked ?? props?.locked ? 'nodrag' : clickable ? 'clickable' : className}`}
      onClick={onClick}
      style={{
        pointerEvents: streamMode ?? props?.streamMode ? 'none' : undefined,
        transform: `rotate(${component?.rotation ?? 0}deg)`,
      }}>
      {!disabled && (
        <NodeResizer
          key={`${component?.locked}`}
          color={component?.locked ? '#E66A3C' : '#417090'}
          isVisible={selected}
          keepAspectRatio={keepAspectRatio}
          handleClassName={component?.locked || component?.rotation !== 0 ? 'hidden' : undefined}
          shouldResize={() => !component?.locked && component?.rotation === 0}
          minWidth={componentType?.minWidth ?? props?.width ?? 0}
          minHeight={componentType?.minHeight ?? props?.height ?? 0}
          maxHeight={componentType?.maxHeight ?? 0}
          maxWidth={componentType?.maxWidth ?? 0}
        />
      )}
      {children}
    </div>
  );
};

export default ResizableNodeSelected;
