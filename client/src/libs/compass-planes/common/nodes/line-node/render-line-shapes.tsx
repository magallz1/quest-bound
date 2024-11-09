import { ComponentTypes, LineComponentData, SheetComponent } from '@/libs/compass-api';
import { useViewport } from 'reactflow';

export const RenderLineShapes = ({ components }: { components: SheetComponent[] }) => {
  let x: number = 0;
  let y: number = 0;
  let zoom: number = 1;

  try {
    const { x: _x, y: _y, zoom: _zoom } = useViewport();
    x = _x / _zoom;
    y = _y / _zoom;
    zoom = _zoom;
  } catch (e) {
    // Swallow. This will throw when now nested under a ReactFlow component, e.g. Stream
    // In such cases, the default values should be used.
  }

  const lineComponents = components.filter((c) => c.type === ComponentTypes.LINE);

  const lineGroupMap = new Map<
    string,
    Array<{ x: number; y: number; layer: number; fill: string }>
  >();

  for (const line of lineComponents) {
    const data = JSON.parse(line.data) as LineComponentData;
    if (!data.fillShape) continue;

    const existingGroup = lineGroupMap.get(data.connectionId);
    if (existingGroup) {
      lineGroupMap.set(data.connectionId, [
        ...existingGroup,
        {
          x: line.x,
          y: line.y,
          fill: data.strokeColor,
          layer: Math.max(...existingGroup.map((g) => g.layer), line.layer),
        },
      ]);
    } else {
      lineGroupMap.set(data.connectionId, [
        { x: line.x, y: line.y, layer: line.layer, fill: data.strokeColor },
      ]);
    }
  }

  const lineShapes = [];

  for (const group of lineGroupMap.values()) {
    const highestLayer = Math.max(...group.map((g) => g.layer));

    const groupHeight = Math.max(...group.map((g) => g.y)) - Math.min(...group.map((g) => g.y));
    const groupWidth = Math.max(...group.map((g) => g.x)) - Math.min(...group.map((g) => g.x));

    const leftMost = Math.min(...group.map((g) => g.x));
    const topMost = Math.min(...group.map((g) => g.y));

    let polygonPath: string[] = [];

    group.forEach((lineNode) => {
      polygonPath.push(`${(lineNode.x - leftMost) * zoom}, ${(lineNode.y - topMost) * zoom}`);
    });
    // Connect the last point to the first point
    polygonPath.push(polygonPath[0]);

    lineShapes.push({
      x: (leftMost + x) * zoom,
      y: (topMost + y) * zoom,
      width: groupWidth * zoom,
      height: groupHeight * zoom,
      zIndex: highestLayer,
      fill: group[0].fill,
      polygonPath,
    });
  }

  return (
    <>
      {lineShapes.map((lineShape, index) => (
        <svg
          id='line-shapes'
          key={index}
          style={{
            position: 'absolute',
            top: lineShape.y,
            left: lineShape.x,
            width: lineShape.width,
            height: lineShape.height,
            zIndex: lineShape.zIndex,
          }}>
          <polygon fill={lineShape.fill} points={lineShape.polygonPath.join(' ')} />
        </svg>
      ))}
    </>
  );
};
