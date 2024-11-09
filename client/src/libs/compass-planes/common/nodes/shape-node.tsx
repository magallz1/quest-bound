import { BoxComponentData, SheetComponent } from '@/libs/compass-api';
import { Box } from '@chakra-ui/react';
import { useNodeId } from 'reactflow';
import ResizableNodeWrapper from '../../common/components/resizable-node-wrapper';
import { useEditorStore } from '../editor-store';
import { useNodeSize, useSubscribeComponentChanges } from '../hooks';
import { getBorderStyles } from '../utils';

export const ShapeNode = () => {
  const getComponent = useEditorStore((state) => state.getComponent);

  const id = useNodeId();
  const component = getComponent(id);

  const key = useSubscribeComponentChanges(id);

  const { height, width } = useNodeSize(component?.id);

  const data = JSON.parse(component?.data ?? '{}') as BoxComponentData;
  const hasAction = Boolean(data.actionId);

  if (!component) return null;
  return (
    <ResizableNodeWrapper
      component={component}
      className={hasAction ? 'clickable' : undefined}
      key={key}>
      <PrimitiveShapeNode
        component={{ ...component, height: parseFloat(height), width: parseFloat(width) }}
      />
    </ResizableNodeWrapper>
  );
};

export const PrimitiveShapeNode = ({ component }: { component: SheetComponent }) => {
  const data = JSON.parse(component.data) as BoxComponentData;
  const css = JSON.parse(component.style);
  const outlineWidth = Math.max(0, parseInt(css.outlineWidth || 0));
  const numSides = data.sides ?? 4;

  // For rectangles, support irregular shapes
  if (numSides === 4) {
    return (
      <Box
        sx={{
          height: `${component.height}px`,
          width: `${component.width}px`,
          zIndex: component.layer,
          ...css,
          ...getBorderStyles(css),
        }}
      />
    );
  }

  return (
    <Polygon
      key={css}
      sides={numSides}
      diameter={component.width}
      color={css.backgroundColor || 'primary.light'}
      outlineWidth={outlineWidth}
      outlineColor={css.outlineColor}
      opacity={css.opacity}
    />
  );
};

const Polygon = ({
  sides,
  diameter,
  color,
  outlineWidth = 0,
  outlineColor,
  className,
  opacity = 1,
}: {
  sides: number;
  diameter: number;
  color: string;
  outlineWidth?: number;
  outlineColor?: string;
  className?: string;
  opacity?: number;
}) => {
  const angle = (2 * Math.PI) / sides;

  const getPoints = (radius: number) => {
    const points = Array.from({ length: sides }, (_, i) => {
      const currAngle = i * angle - Math.PI / 2;
      return [radius + radius * Math.cos(currAngle), radius + radius * Math.sin(currAngle)].join(
        ',',
      );
    }).join(' ');
    return points;
  };

  return (
    <svg
      viewBox={`0 0 ${diameter} ${diameter}`}
      style={{ overflow: 'visible', width: diameter }}
      className={className}>
      <polygon
        vectorEffect='non-scaling-stroke'
        points={getPoints(diameter / 2)}
        fill={color}
        stroke={outlineColor}
        opacity={opacity}
        strokeWidth={`${outlineWidth}px`}
      />
    </svg>
  );
};
