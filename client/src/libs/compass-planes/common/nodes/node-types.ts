import { ComponentTypes, getComponentType } from '@/libs/compass-api';
import { NodeTypes } from 'reactflow';
import { CanvasNode } from './canvas-node';
import { ChartNode } from './chart-node';
import { CheckboxNode } from './checkbox-node';
import { ContentNode } from './content-node';
import { FrameNode } from './frame-node';
import { GraphNode } from './graph-node';
import { ImageNode } from './image-node';
import { InputNode } from './input-node';
import { InventoryNode, ItemNode } from './inventory-node';
import { LineNode } from './line-node';
import { PdfNode } from './pdf-node';
import { ShapeNode } from './shape-node';
import { TextNode } from './text-node';

export const sheetNodeTypes: NodeTypes = {
  [ComponentTypes.TEXT]: TextNode,
  [ComponentTypes.IMAGE]: ImageNode,
  [ComponentTypes.INPUT]: InputNode,
  [ComponentTypes.SHAPE]: ShapeNode,
  [ComponentTypes.CHECKBOX]: CheckboxNode,
  [ComponentTypes.FRAME]: FrameNode,
  [ComponentTypes.LINE]: LineNode,
  [ComponentTypes.CONTENT]: ContentNode,
  [ComponentTypes.CANVAS]: CanvasNode,
  [ComponentTypes.NOTES]: ContentNode,
  [ComponentTypes.GRAPH]: GraphNode,
  [ComponentTypes.CHART]: ChartNode,
  [ComponentTypes.PDF]: PdfNode,
  [ComponentTypes.INVENTORY]: InventoryNode,
  [ComponentTypes.ITEM]: ItemNode,
};

export type EditorMenuOption = {
  name: string;
  nodeType: ComponentTypes;
  description?: string;
};

export const contextOptions: EditorMenuOption[] = [
  {
    name: 'Text',
    nodeType: ComponentTypes.TEXT,
    description: getComponentType(ComponentTypes.TEXT).description,
  },
  {
    name: 'Input',
    nodeType: ComponentTypes.INPUT,
    description: getComponentType(ComponentTypes.INPUT).description,
  },
  {
    name: 'Image',
    nodeType: ComponentTypes.IMAGE,
    description: getComponentType(ComponentTypes.IMAGE).description,
  },
  {
    name: 'Checkbox',
    nodeType: ComponentTypes.CHECKBOX,
    description: getComponentType(ComponentTypes.CHECKBOX).description,
  },
  {
    name: 'Shape',
    nodeType: ComponentTypes.SHAPE,
    description: getComponentType(ComponentTypes.SHAPE).description,
  },
  {
    name: 'Frame',
    nodeType: ComponentTypes.FRAME,
    description: getComponentType(ComponentTypes.FRAME).description,
  },
  {
    name: 'Inventory',
    nodeType: ComponentTypes.INVENTORY,
    description: getComponentType(ComponentTypes.INVENTORY).description,
  },
  {
    name: 'Line',
    nodeType: ComponentTypes.LINE,
    description: getComponentType(ComponentTypes.LINE).description,
  },
  {
    name: 'Graph',
    nodeType: ComponentTypes.GRAPH,
    description: getComponentType(ComponentTypes.GRAPH).description,
  },
  {
    name: 'Content',
    nodeType: ComponentTypes.CONTENT,
    description: getComponentType(ComponentTypes.CONTENT).description,
  },
  {
    name: 'Canvas',
    nodeType: ComponentTypes.CANVAS,
    description: getComponentType(ComponentTypes.CANVAS).description,
  },
  {
    name: 'Notes',
    nodeType: ComponentTypes.NOTES,
    description: getComponentType(ComponentTypes.NOTES).description,
  },
  {
    name: 'Chart',
    nodeType: ComponentTypes.CHART,
    description: getComponentType(ComponentTypes.CHART).description,
  },
  {
    name: 'Document',
    nodeType: ComponentTypes.PDF,
    description: getComponentType(ComponentTypes.PDF).description,
  },
];
