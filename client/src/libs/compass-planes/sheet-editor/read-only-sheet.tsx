import { SheetComponent } from '@/libs/compass-api';
import { RenderLineShapes } from '../common/nodes/line-node/render-line-shapes';
import { RenderPrimitiveNode } from '../common/render-primitive-node';

interface Props {
  components: SheetComponent[];
}

/**
 * Renders components without context or logic. Component values are read directly from the provided data.
 */
export const ReadOnlySheet = ({ components }: Props) => {
  return (
    <>
      {components.map((component) => (
        <div
          key={component.id}
          style={{
            position: 'absolute',
            top: component.y,
            left: component.x,
            zIndex: component.layer,
            transform: `rotate(${component?.rotation ?? 0}deg)`,
          }}>
          <RenderPrimitiveNode component={component} components={components} />
        </div>
      ))}
      <RenderLineShapes components={components} />
    </>
  );
};
