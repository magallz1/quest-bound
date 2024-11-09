import { BaseEdge, getSmoothStepPath, Position, useEdges } from 'reactflow';
import { ioTypeToColor } from '../node-data';
import { IOType } from '../types';

type EdgeData = {
  targetIOType: IOType;
  sourceIOType: IOType;
};

export interface CustomEdgeProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  data?: EdgeData;
}

export const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, data }: CustomEdgeProps) => {
  const edges = useEdges();

  const thisEdge = edges.find((edge) => edge.id === id);
  const isSelected = thisEdge?.selected ?? false;

  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  });

  const colorIOType =
    data?.sourceIOType === IOType.OutputIfTrue || data?.sourceIOType === IOType.OutputIfFalse
      ? data?.sourceIOType
      : data?.targetIOType;

  const style = {
    stroke: ioTypeToColor.get(colorIOType ?? IOType.Output) ?? '#417090',
    strokeOpacity: 1,
    strokeWidth: '6px',
  };

  return (
    <>
      {isSelected && (
        <BaseEdge
          id={id}
          path={edgePath}
          style={{ ...style, strokeWidth: '8px', stroke: '#FAF7F2' }}
        />
      )}
      <BaseEdge id={id} path={edgePath} style={style} />
    </>
  );
};
