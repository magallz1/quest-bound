import { AttributeContext, GraphComponentData, SheetComponent } from '@/libs/compass-api';
import { Stack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import { useNodeId } from 'reactflow';
import ResizableNodeWrapper from '../../common/components/resizable-node-wrapper';
import { IOType, Logic, OperationType } from '../../logic-editor';
import { useEditorStore } from '../editor-store';
import { useNodeSize, useSubscribeComponentChanges } from '../hooks';
import { getBorderStyles } from '../utils';

export const GraphNode = () => {
  const getComponent = useEditorStore((state) => state.getComponent);
  const id = useNodeId();

  const component = getComponent(id);

  const key = useSubscribeComponentChanges(id);

  const { height, width } = useNodeSize(component?.id ?? '');
  const componentData = JSON.parse(component?.data ?? '{}') as GraphComponentData;

  const attributeContext = useContext(AttributeContext);
  const getAttribute = attributeContext?.getAttribute;

  if (!component) return null;

  const assignedAttribute = getAttribute?.(componentData.attributeId);
  const maxAssignedAttribute = getAttribute?.(componentData.maxValueAttributeId);

  const assignedAttributeLogic = (assignedAttribute?.logic ?? []) as Logic;
  const defaultValueNode = assignedAttributeLogic.find(
    (op) => op.type === OperationType.DefaultValue,
  );
  const maxValueNode = assignedAttributeLogic.find((op) =>
    op.connections.some(
      (c) => c.id === defaultValueNode?.id && c.targetType === ('parameter:b' as IOType),
    ),
  );

  const attributeMax = maxValueNode ? parseFloat(`${maxValueNode.value}`) : undefined;

  const value = assignedAttribute?.value ? parseFloat(assignedAttribute?.value) : undefined;
  const maxValue = maxAssignedAttribute ? parseFloat(maxAssignedAttribute.value) : attributeMax;

  return (
    <ResizableNodeWrapper component={component} key={key}>
      <PrimitiveGraphNode
        component={{ ...component, height: parseFloat(height), width: parseFloat(width) }}
        value={value}
        maxValue={maxValue}
      />
    </ResizableNodeWrapper>
  );
};

export const PrimitiveGraphNode = ({
  component,
  value: _value,
  maxValue: _maxValue,
}: {
  component: SheetComponent;
  value?: number;
  maxValue?: number;
}) => {
  const css = JSON.parse(component.style);
  const componentData = JSON.parse(component.data) as GraphComponentData;

  const value = _value ?? componentData.value;
  const maxValue = _maxValue ?? componentData.maxValue;

  const animationDelay = componentData.animationDelay ?? 0.5;
  const type = componentData.type ?? 'horizontal';
  const inverse = componentData.inverse ?? false;
  const isRadial = type === 'radial';

  const height = `${component.height}px`;
  const width = `${component.width}px`;
  const bgcolor = css.backgroundColor ?? 'primary.light';
  const barColor = css.color ?? 'info.main';

  const fillDirection = inverse
    ? type === 'horizontal'
      ? 'to left'
      : 'to bottom'
    : type === 'horizontal'
      ? 'to right'
      : 'to top';

  const incalculable = maxValue === undefined || value === undefined;

  const percentage = incalculable ? 5 : Math.max(0, Math.min(100, (value / maxValue) * 100));
  const inversePercentage = 100 - percentage;
  const radialPercentage = inverse ? inversePercentage : percentage;

  const circumference = 2 * Math.PI * (component.height / 2 / 2);

  return (
    <Stack
      spacing={1}
      style={{
        height,
        width,
        opacity: css.opacity,
        backgroundColor: isRadial ? 'rgba(0,0,0,0)' : undefined,
        justifyContent: 'flex-end',
        ...(!isRadial && {
          ...getBorderStyles(css),
        }),
        ...(inverse &&
          isRadial && {
            transform: `rotate(180deg)`,
          }),
      }}>
      {type === 'radial' ? (
        <motion.svg
          fill='transparent'
          key={`${inverse}`}
          style={{
            height: '100%',
            width: '100%',
            opacity: css.opacity,
            transform: inverse ? 'rotate(90deg)' : 'rotate(-90deg)',
          }}>
          <motion.circle
            cx={component.width / 2}
            cy={component.height / 2}
            r={component.height / 2}
            fill={css.backgroundColor}
          />
          <motion.circle
            cx={component.width / 2}
            cy={component.height / 2}
            r={component.height / 2 / 2}
            fill='tranparent'
            stroke={css.color}
            strokeWidth={component.height / 2}
            transition={{ duration: 0.5, delay: animationDelay }}
            animate={{
              strokeDasharray: `${(radialPercentage * circumference) / 100} ${circumference}`,
            }}
          />
        </motion.svg>
      ) : (
        <motion.div
          key={inverse.toString()}
          style={{
            height: '100%',
            width: '100%',
            ...getBorderStyles(css),
          }}
          initial={{
            background: `linear-gradient(${fillDirection}, ${barColor} 0%, ${bgcolor} 0%)`,
          }}
          animate={{
            background: `linear-gradient(${fillDirection}, ${barColor} ${percentage}%, ${bgcolor} ${percentage}%)`,
          }}
          transition={{ duration: 0.5, delay: animationDelay }}
        />
      )}
    </Stack>
  );
};
