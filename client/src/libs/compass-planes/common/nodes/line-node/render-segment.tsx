import { LineComponentData, SheetComponent } from '@/libs/compass-api';
import { useEditorStore } from '../../editor-store';

interface RenderSegmentProps {
  componentId: string;
  activeComponents?: SheetComponent[];
  y: number;
  viewMode?: boolean;
}

/**
 * Renders a segment between this Line component and the one it's connected to.
 */
export const RenderSegment = ({
  componentId,
  y,
  activeComponents: _activeComponents,
}: RenderSegmentProps) => {
  const storedComponents = useEditorStore((state) => state.components);
  const activeComponents = _activeComponents ?? storedComponents;

  const component = activeComponents.find((c) => c.id === componentId);

  if (!component) return null;

  const componentData = JSON.parse(component.data) as LineComponentData;

  const connectedComponent = activeComponents.find((c) => {
    const data = JSON.parse(c.data) as LineComponentData;
    return data.connectedId === component.id;
  });

  if (!connectedComponent) return null;

  const connectedComponents = [component, connectedComponent];

  const minX = Math.min(...connectedComponents.map((n) => n.x));
  const minY = Math.min(...connectedComponents.map((n) => n.y - y));
  const maxX = Math.max(...connectedComponents.map((n) => n.x));
  const maxY = Math.max(...connectedComponents.map((n) => n.y - y));

  const boundingBox = {
    x1: minX,
    y1: minY,
    x2: maxX,
    y2: maxY,
  };

  const linePath = connectedComponents
    .map((n) => {
      return `${n.x - minX} ${n.y - minY - y}`;
    })
    .join(', ');

  const highestLayer = Math.max(...connectedComponents.map((n) => n.layer));
  const largestStrokeWidth = Math.max(
    ...connectedComponents.map((n) => JSON.parse(n.data).strokeWidth),
  );

  if (!linePath) return null;

  return (
    <svg
      key={linePath}
      id='line-segment'
      style={{
        pointerEvents: 'none',
        position: 'absolute',
        top: Math.min(0, (component.y - connectedComponent.y) * -1),
        left: Math.min(0, (component.x - connectedComponent.x) * -1),
        zIndex: highestLayer,
      }}
      height={Math.abs(boundingBox.y1 - boundingBox.y2) + componentData.strokeWidth * 2}
      width={Math.abs(boundingBox.x1 - boundingBox.x2) + componentData.strokeWidth * 2}>
      <path
        key={linePath}
        d={`M ${linePath}`}
        stroke={componentData.strokeColor}
        strokeWidth={largestStrokeWidth}
        fill='transparent'
      />
    </svg>
  );
};
