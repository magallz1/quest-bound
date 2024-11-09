import { ComponentTypes, SheetComponent } from '@/libs/compass-api';
import { PrimitiveCanvasNode } from './nodes/canvas-node';
import { PrimitiveCheckboxNode } from './nodes/checkbox-node';
import { PrimitiveContentNode } from './nodes/content-node';
import { PrimitiveFrameNode } from './nodes/frame-node';
import { PrimitiveGraphNode } from './nodes/graph-node';
import { PrimitiveImageNode } from './nodes/image-node';
import { PrimitiveInputNode } from './nodes/input-node';
import { RenderSegment } from './nodes/line-node/render-segment';
import { PrimitiveShapeNode } from './nodes/shape-node';
import { PrimitiveTextNode } from './nodes/text-node';

interface Props {
  component: SheetComponent;
  components: SheetComponent[];
}

export const RenderPrimitiveNode = ({ component, components }: Props) => {
  switch (component.type) {
    case ComponentTypes.TEXT:
      return <PrimitiveTextNode component={component} />;
    case ComponentTypes.INPUT:
      return <PrimitiveInputNode component={component} />;
    case ComponentTypes.CHECKBOX:
      return <PrimitiveCheckboxNode component={component} />;
    case ComponentTypes.SHAPE:
      return <PrimitiveShapeNode component={component} />;
    case ComponentTypes.IMAGE:
      return <PrimitiveImageNode component={component} />;
    case ComponentTypes.FRAME:
      return <PrimitiveFrameNode component={component} />;
    case ComponentTypes.GRAPH:
      return <PrimitiveGraphNode component={component} />;
    case ComponentTypes.CONTENT:
    case ComponentTypes.NOTES:
      return <PrimitiveContentNode component={component} />;
    case ComponentTypes.CANVAS:
      return <PrimitiveCanvasNode component={component} />;
    case ComponentTypes.LINE:
      return <RenderSegment componentId={component.id} y={0} activeComponents={components} />;
    // case ComponentTypes.ITEM:
    //   return <PrimitiveInventoryNode component={component} />;

    default:
      return null;
  }
};
