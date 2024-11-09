import { Text } from '@/libs/compass-core-ui';
import {
  Abc,
  Backpack,
  BackupTable,
  Balance,
  Calculate,
  CallSplit,
  Casino,
  ChangeHistory,
  ChecklistRtl,
  DocumentScanner,
  Equalizer,
  Filter1,
  Input,
  Label,
  Laptop,
  Person,
  Pets,
  Rule,
  Square,
  TableChart,
  Timeline,
  ToggleOn,
  Wysiwyg,
} from '@mui/icons-material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import GestureIcon from '@mui/icons-material/Gesture';
import ImageIcon from '@mui/icons-material/Image';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import React, { ReactNode } from 'react';
import { SheetComponent, UpdateSheetComponent, Viewport } from '../../index';
import {
  defaultContentComponentContent,
  defaultNoteComponentContent,
  defaultSheetEmptyValue,
  DEFAULT_GRID_SIZE,
  MAX_SIZE,
} from './defaults';

export type SheetTab = {
  tabId: string;
  title: string;
  position: number;
  conditionalRenderAttributeId?: string | null;
  conditionalRenderInverse?: boolean;
};

export type SheetSection = {
  id: string;
  tabId: string;
  title: string;
  color: string;
  height: number;
  width: number;
  desktopX: number;
  desktopY: number;
  tabletX: number;
  tabletY: number;
  mobileX: number;
  mobileY: number;
};

export type SheetDetails = {
  defaultFont?: string;
  colors?: string[];
  snapToGrid?: boolean;
  renderGrid?: 'square' | 'dot' | false;
  enableLogic?: boolean;
  backgroundImg?: string;
  backgroundImgOpacity?: number;
  backgroundImgSize?: 'cover' | 'contain';
  showComponentCoordinates?: boolean;
};

export const viewportDimensions = {
  [Viewport.DESKTOP]: { width: 40 * 20, height: 60 * 20 },
  [Viewport.TABLET]: { width: 35 * 20, height: 60 * 20 },
  [Viewport.MOBILE]: { width: 17 * 20, height: 28 * 20 },
};

export enum SheetView {
  EDIT = 'edit',
  PLAY = 'play',
}

export type ComponentNodeProps = {
  component: SheetComponent;
  className?: string;
  onMouseDown?: (e: React.MouseEvent) => void;
  onMouseUp?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
};

// Undo / Redo
export enum ActionType {
  UPDATE = 'update',
  DELETE = 'delete',
  CREATE = 'create',
}

export type Action = {
  type: ActionType;
  data: Array<Omit<UpdateSheetComponent, 'rulesetId' | 'sheetId'>>;
  snapshot?: SheetComponent[];
};

export type ConnectionPoint = {
  connectionPointId?: string;
  connectionColor?: string;
  // Relative to the component
  connectionX?: number;
  connectionY?: number;
};

export type ConnectionData = {
  points: ConnectionPoint[];
};

export type ComponentData = {
  conditionalRenderAttributeId?: string;
  conditionalRenderInverse?: boolean;
  actionId?: string;
  pageId?: string | null;
  announcementId?: string | null;
};

export type TextComponentData = ComponentData & {
  value: string;
  autoScale: boolean;
  attributeId?: string | null;
  alwaysShowSign?: boolean;
};

export type BoxComponentData = ComponentData & {
  sides: number;
};

export type CanvasComponentData = ComponentData & {
  elements: Array<any>; // ExcalidrawElement[];
  appState: any; // Excalidraw App State
};

export type CheckboxComponentData = ComponentData & {
  type: 'radio' | 'checkbox';
  value: 'true' | 'false'; // Need to stringify the boolean for logical operations
  imageIfChecked: string;
  imageIfUnchecked: string;
  attributeId?: string | null;
  alwaysShowSign?: boolean;
};

export type InputComponentData = ComponentData & {
  value: string;
  type: 'number' | 'text';
  attributeId?: string | null;
  alwaysShowSign?: boolean;
  hideWheel?: boolean;
};

export type ImageComponentData = ComponentData & {
  url: string;
  useEntityImage?: boolean;
  alt?: string;
  attributeId?: string | null;
};

export type LineComponentData = ComponentData & {
  pointId: string; // UUID for the point
  connectedId: string; // The pointId of the component it's connected to
  connectionId: string; // UUID for the connection itself
  strokeWidth: number;
  strokeColor: string;
  index: number;
  fillShape: boolean;
};

export type ContentComponentData = ComponentData & {
  editorLocked: boolean;
  content: string;
  useEntityDescription?: boolean;
};

export type ChartComponentData = ComponentData & {
  chartId: string;
  rulesetId: string;
  headerBgColor: string;
  evenRowBgColor: string;
  oddRowBgColor: string;
  tableOutlineColor: string;
  rowVerticalSpacing: string;
  rowHorizontalSpacing: string;
};

export type PdfComponentData = ComponentData & {
  fileSrc: string;
  pageNumber: number;
  autoScale: boolean;
};

export type GraphComponentData = ComponentData & {
  attributeId?: string | null;
  maxValueAttributeId?: string | null;
  alwaysShowSign?: boolean;
  type?: 'vertical' | 'horizontal' | 'radial';
  inverse?: boolean;
  animationDelay?: number;
  // Used for primitive graph nodes
  value?: number;
  maxValue?: number;
};

export type ItemNodeData = ComponentData & {
  itemId: string;
};

export type FrameComponentData = ComponentData & {
  url: string;
};

export type InventoryComponentData = ComponentData & {
  slotKeys: string;
  url?: string;
  alt?: string;
  isText?: boolean;
};

export type SheetComponentType = {
  type: ComponentTypes;
  label: string;
  hideInPanel?: boolean;
  description?: string;
  defaultLayer: number;
  minHeight: number;
  maxHeight: number;
  minWidth: number;
  maxWidth: number;
  defaultWidth: number;
  defaultHeight: number;
  transparent: boolean;
  scalable: boolean;
  defaultRotation: number;
  dragHandle?: boolean;
  hasDoubleClickAction?: boolean;
};

export enum ComponentTypes {
  TEXT = 'text',
  IMAGE = 'image',
  SHAPE = 'shape',
  INPUT = 'text-input',
  CHECKBOX = 'checkbox',
  CANVAS = 'canvas',
  NOTES = 'notesV2',
  LINE = 'line',
  CONTENT = 'content',
  CHART = 'chart',
  PDF = 'pdf',
  GRAPH = 'graph',
  CUSTOM = 'custom',
  FRAME = 'frame',
  INVENTORY = 'inventory',
  // LOGIC
  DEFAULT_VALUE = 'default-value',
  SIDE_EFFECT = 'side-effects',
  VARIABLE = 'variable',
  ATTRIBUTE = 'attribute',
  CHART_REF = 'chart_ref',
  DICE = 'dice',
  IF = 'if',
  AND = 'and',
  OR = 'or',
  OPERATION = 'operation',
  COMPARISON = 'comparison',
  NUMBER_PRIMITIVE = 'number',
  TEXT_PRIMITIVE = 'text_primitive',
  BOOLEAN = 'boolean',
  // MANAGE
  ARCHETYPE = 'archetype',
  CREATURE = 'creature',
  // INVENTORY
  ITEM = 'item',
}

export const componentTypesRestrictedFromDelete = new Set<ComponentTypes | string>([
  ComponentTypes.DEFAULT_VALUE,
]);

export const componentTypeToLabel = new Map<ComponentTypes, string>([
  [ComponentTypes.TEXT, 'Text'],
  [ComponentTypes.IMAGE, 'Image'],
  [ComponentTypes.SHAPE, 'Shape'],
  [ComponentTypes.INPUT, 'Input'],
  [ComponentTypes.CHECKBOX, 'Checkbox'],
  [ComponentTypes.CANVAS, 'Canvas'],
  [ComponentTypes.NOTES, 'Notes'],
  [ComponentTypes.LINE, 'Line'],
  [ComponentTypes.CONTENT, 'Content'],
  [ComponentTypes.CHART, 'Chart'],
  [ComponentTypes.PDF, 'PDF'],
  [ComponentTypes.GRAPH, 'Graph'],
  [ComponentTypes.FRAME, 'Frame'],
  [ComponentTypes.INVENTORY, 'Inventory'],
  [ComponentTypes.DEFAULT_VALUE, 'Default Value'],
  [ComponentTypes.SIDE_EFFECT, 'Side Effect'],
  [ComponentTypes.ATTRIBUTE, 'Attribute'],
  [ComponentTypes.CHART_REF, 'Chart'],
  [ComponentTypes.DICE, 'Dice'],
  [ComponentTypes.IF, 'If'],
  [ComponentTypes.AND, 'And'],
  [ComponentTypes.OR, 'Or'],
  [ComponentTypes.OPERATION, 'Operation'],
  [ComponentTypes.COMPARISON, 'Comparison'],
  [ComponentTypes.NUMBER_PRIMITIVE, 'Number'],
  [ComponentTypes.TEXT_PRIMITIVE, 'Text'],
  [ComponentTypes.BOOLEAN, 'Boolean'],
  [ComponentTypes.ARCHETYPE, 'Archetype'],
  [ComponentTypes.CREATURE, 'Creature'],
  [ComponentTypes.ITEM, 'Item'],
]);

export const allComponentTypes = [
  ComponentTypes.TEXT,
  ComponentTypes.IMAGE,
  ComponentTypes.SHAPE,
  ComponentTypes.INPUT,
  ComponentTypes.CHECKBOX,
  ComponentTypes.CANVAS,
  ComponentTypes.NOTES,
  ComponentTypes.LINE,
  ComponentTypes.CONTENT,
  ComponentTypes.FRAME,
  ComponentTypes.CHART,
  ComponentTypes.PDF,
  ComponentTypes.GRAPH,
  ComponentTypes.ARCHETYPE,
  ComponentTypes.CREATURE,
  ComponentTypes.ITEM,
  ComponentTypes.INVENTORY,
];

// Dictates the order within the component panel
export const allLogicComponentTypes = [
  ComponentTypes.DEFAULT_VALUE,
  ComponentTypes.ATTRIBUTE,
  ComponentTypes.CHART_REF,
  ComponentTypes.SIDE_EFFECT,
  ComponentTypes.VARIABLE,
  ComponentTypes.IF,
  ComponentTypes.AND,
  ComponentTypes.OR,
  ComponentTypes.COMPARISON,
  ComponentTypes.OPERATION,
  ComponentTypes.DICE,
  ComponentTypes.NUMBER_PRIMITIVE,
  ComponentTypes.TEXT_PRIMITIVE,
  ComponentTypes.BOOLEAN,
];

export enum TextInputType {
  TEXT = 'text',
  NUMBER = 'number',
}

export type LogicalComponentData = InputComponentData | CheckboxComponentData;

export const typeToIconMap = new Map<ComponentTypes, ReactNode>([
  [ComponentTypes.TEXT, <TextFieldsIcon />],
  [ComponentTypes.INPUT, <KeyboardIcon />],
  [ComponentTypes.IMAGE, <ImageIcon />],
  [ComponentTypes.CHECKBOX, <CheckBoxIcon />],
  [ComponentTypes.SHAPE, <Square />],
  [ComponentTypes.NOTES, <AutoStoriesIcon />],
  [ComponentTypes.CANVAS, <GestureIcon />],
  [ComponentTypes.LINE, <Timeline />],
  [ComponentTypes.CONTENT, <Wysiwyg />],
  [ComponentTypes.CHART, <TableChart />],
  [ComponentTypes.PDF, <DocumentScanner />],
  [ComponentTypes.GRAPH, <Equalizer />],
  [ComponentTypes.FRAME, <Laptop />],
  // Logic
  [ComponentTypes.DEFAULT_VALUE, <Input />],
  [ComponentTypes.SIDE_EFFECT, <ChangeHistory />],
  [ComponentTypes.VARIABLE, <Text sx={{ fontSize: '0.9rem' }}>xy</Text>],
  [ComponentTypes.IF, <CallSplit sx={{ transform: 'rotate(180deg)' }} />],
  [ComponentTypes.AND, <ChecklistRtl />],
  [ComponentTypes.OR, <Rule />],
  [ComponentTypes.OPERATION, <Calculate />],
  [ComponentTypes.COMPARISON, <Balance />],
  [ComponentTypes.ATTRIBUTE, <Label />],
  [ComponentTypes.NUMBER_PRIMITIVE, <Filter1 />],
  [ComponentTypes.TEXT_PRIMITIVE, <Abc />],
  [ComponentTypes.BOOLEAN, <ToggleOn />],
  [ComponentTypes.CHART_REF, <BackupTable />],
  [ComponentTypes.DICE, <Casino />],
  // Manage
  [ComponentTypes.ARCHETYPE, <Person />],
  [ComponentTypes.CREATURE, <Pets />],
  // Inventory
  [ComponentTypes.ITEM, <Backpack />],
]);

export type ViewportDimensions = Record<Viewport, { height: number; width: number }>;

export const baseComponentTypes: SheetComponentType[] = [
  {
    label: 'Text',
    description: 'Static text with adjustable styles.',
    type: ComponentTypes.TEXT,
    minWidth: DEFAULT_GRID_SIZE,
    minHeight: DEFAULT_GRID_SIZE,
    defaultWidth: 4 * DEFAULT_GRID_SIZE,
    defaultHeight: 1 * DEFAULT_GRID_SIZE,
    maxHeight: MAX_SIZE * DEFAULT_GRID_SIZE,
    maxWidth: MAX_SIZE * DEFAULT_GRID_SIZE,
    defaultRotation: 0,
    defaultLayer: 2,
    transparent: true,
    scalable: true,
    hasDoubleClickAction: true,
  },
  {
    label: 'Input',
    description:
      'An input field for players to enter text or to control text and number attributes.',
    type: ComponentTypes.INPUT,
    minWidth: DEFAULT_GRID_SIZE,
    minHeight: DEFAULT_GRID_SIZE,
    defaultWidth: 6 * DEFAULT_GRID_SIZE,
    defaultHeight: 2 * DEFAULT_GRID_SIZE,
    maxHeight: 8 * DEFAULT_GRID_SIZE,
    maxWidth: MAX_SIZE * DEFAULT_GRID_SIZE,
    defaultRotation: 0,
    defaultLayer: 2,
    transparent: true,
    scalable: true,
  },
  {
    label: 'Image',
    description: 'Displays a selected image or one from a given URL.',
    type: ComponentTypes.IMAGE,
    minWidth: DEFAULT_GRID_SIZE,
    minHeight: DEFAULT_GRID_SIZE,
    defaultWidth: 5 * DEFAULT_GRID_SIZE,
    defaultHeight: 5 * DEFAULT_GRID_SIZE,
    maxHeight: MAX_SIZE * DEFAULT_GRID_SIZE,
    maxWidth: MAX_SIZE * DEFAULT_GRID_SIZE,
    defaultRotation: 0,
    defaultLayer: 2,
    scalable: true,
    transparent: true,
  },
  {
    label: 'Checkbox',
    description: 'Tracks true/false values and controls boolean attributes.',
    type: ComponentTypes.CHECKBOX,
    minWidth: DEFAULT_GRID_SIZE,
    minHeight: DEFAULT_GRID_SIZE,
    defaultWidth: 1 * DEFAULT_GRID_SIZE,
    defaultHeight: 1 * DEFAULT_GRID_SIZE,
    maxHeight: MAX_SIZE * DEFAULT_GRID_SIZE,
    maxWidth: MAX_SIZE * DEFAULT_GRID_SIZE,
    defaultRotation: 0,
    defaultLayer: 2,
    scalable: false,
    transparent: true,
  },
  {
    label: 'Shape',
    description:
      'A rectangle or regular polygon. Useful for creating backgrounds and visually distinct sections.',
    type: ComponentTypes.SHAPE,
    minWidth: DEFAULT_GRID_SIZE,
    minHeight: DEFAULT_GRID_SIZE,
    defaultWidth: 3 * DEFAULT_GRID_SIZE,
    defaultHeight: 3 * DEFAULT_GRID_SIZE,
    maxHeight: MAX_SIZE * DEFAULT_GRID_SIZE,
    maxWidth: MAX_SIZE * DEFAULT_GRID_SIZE,
    defaultRotation: 0,
    defaultLayer: 2,
    transparent: true,
    scalable: true,
  },
  {
    label: 'Line',
    description: 'Add connection points together to draw lines and create irregular polygons.',
    type: ComponentTypes.LINE,
    minWidth: DEFAULT_GRID_SIZE,
    minHeight: DEFAULT_GRID_SIZE,
    defaultWidth: DEFAULT_GRID_SIZE,
    defaultHeight: DEFAULT_GRID_SIZE,
    maxHeight: DEFAULT_GRID_SIZE,
    maxWidth: DEFAULT_GRID_SIZE,
    defaultRotation: 0,
    defaultLayer: 2,
    transparent: true,
    scalable: false,
  },
  {
    label: 'Canvas',
    description:
      'A canvas for players to draw freehand. The canvas may be zoomed or panned infinitely in all directions.',
    type: ComponentTypes.CANVAS,
    defaultWidth: 8 * DEFAULT_GRID_SIZE,
    defaultHeight: 8 * DEFAULT_GRID_SIZE,
    minWidth: DEFAULT_GRID_SIZE,
    minHeight: DEFAULT_GRID_SIZE,
    maxHeight: MAX_SIZE * DEFAULT_GRID_SIZE,
    maxWidth: MAX_SIZE * DEFAULT_GRID_SIZE,
    defaultRotation: 0,
    defaultLayer: 2,
    transparent: true,
    scalable: true,
  },
  {
    label: 'Notes',
    description:
      'A scrolling rich text editor for players to take notes. Supports various font sizes, styles and lists.',
    type: ComponentTypes.NOTES,
    minWidth: DEFAULT_GRID_SIZE,
    minHeight: DEFAULT_GRID_SIZE,
    defaultWidth: 15 * DEFAULT_GRID_SIZE,
    defaultHeight: 10 * DEFAULT_GRID_SIZE,
    maxHeight: MAX_SIZE * DEFAULT_GRID_SIZE,
    maxWidth: MAX_SIZE * DEFAULT_GRID_SIZE,
    defaultRotation: 0,
    defaultLayer: 1,
    transparent: true,
    scalable: true,
  },
  {
    label: 'Content',
    description: 'A rich text editor window for displaying static text and decorators.',
    type: ComponentTypes.CONTENT,
    minWidth: DEFAULT_GRID_SIZE,
    minHeight: DEFAULT_GRID_SIZE,
    defaultWidth: 15 * DEFAULT_GRID_SIZE,
    defaultHeight: 10 * DEFAULT_GRID_SIZE,
    maxHeight: MAX_SIZE * DEFAULT_GRID_SIZE,
    maxWidth: MAX_SIZE * DEFAULT_GRID_SIZE,
    defaultRotation: 0,
    defaultLayer: 1,
    transparent: true,
    scalable: true,
  },
  {
    label: 'Chart',
    description: 'Displays a table from a selected ruleset chart.',
    type: ComponentTypes.CHART,
    minWidth: DEFAULT_GRID_SIZE,
    minHeight: DEFAULT_GRID_SIZE,
    defaultWidth: 15 * DEFAULT_GRID_SIZE,
    defaultHeight: 10 * DEFAULT_GRID_SIZE,
    maxHeight: MAX_SIZE * DEFAULT_GRID_SIZE,
    maxWidth: MAX_SIZE * DEFAULT_GRID_SIZE,
    defaultRotation: 0,
    defaultLayer: 2,
    transparent: true,
    scalable: true,
  },
  {
    label: 'Document',
    description:
      'Displays a single page of the assigned rulebook document. Assign a document to the rulebook from the documents page.',
    type: ComponentTypes.PDF,
    minWidth: DEFAULT_GRID_SIZE,
    minHeight: DEFAULT_GRID_SIZE,
    defaultWidth: 15 * DEFAULT_GRID_SIZE,
    defaultHeight: 10 * DEFAULT_GRID_SIZE,
    maxHeight: MAX_SIZE * DEFAULT_GRID_SIZE,
    maxWidth: MAX_SIZE * DEFAULT_GRID_SIZE,
    defaultRotation: 0,
    defaultLayer: 1,
    transparent: true,
    scalable: true,
  },
  {
    label: 'Graph',
    description:
      "A radial, vertical or horizontal bar representing the ratio between an attribute's value and its maximum value, or its value and another attribute.",
    type: ComponentTypes.GRAPH,
    minWidth: DEFAULT_GRID_SIZE,
    minHeight: DEFAULT_GRID_SIZE,
    defaultWidth: 14 * DEFAULT_GRID_SIZE,
    defaultHeight: 2 * DEFAULT_GRID_SIZE,
    maxHeight: MAX_SIZE * DEFAULT_GRID_SIZE,
    maxWidth: MAX_SIZE * DEFAULT_GRID_SIZE,
    defaultRotation: 0,
    defaultLayer: 2,
    transparent: true,
    scalable: true,
  },
  {
    label: 'Frame',
    description: 'A window for displaying and interacting with an external website.',
    type: ComponentTypes.FRAME,
    minWidth: DEFAULT_GRID_SIZE,
    minHeight: DEFAULT_GRID_SIZE,
    defaultWidth: 15 * DEFAULT_GRID_SIZE,
    defaultHeight: 10 * DEFAULT_GRID_SIZE,
    maxHeight: MAX_SIZE * DEFAULT_GRID_SIZE,
    maxWidth: MAX_SIZE * DEFAULT_GRID_SIZE,
    defaultRotation: 0,
    defaultLayer: 2,
    transparent: true,
    scalable: true,
  },
  {
    label: 'Inventory',
    description: 'An area for placing and controlling items.',
    type: ComponentTypes.INVENTORY,
    minWidth: DEFAULT_GRID_SIZE,
    minHeight: DEFAULT_GRID_SIZE,
    defaultWidth: 8 * DEFAULT_GRID_SIZE,
    defaultHeight: 4 * DEFAULT_GRID_SIZE,
    maxHeight: MAX_SIZE * DEFAULT_GRID_SIZE,
    maxWidth: MAX_SIZE * DEFAULT_GRID_SIZE,
    defaultRotation: 0,
    defaultLayer: 1,
    transparent: true,
    scalable: true,
  },
];

export const getComponentType = (type: ComponentTypes): SheetComponentType => {
  return baseComponentTypes.find((comp) => comp.type === type)!;
};

export type SheetComponentValue = {
  data: string;
  style: string;
};

export const defaultSheetValueMap = new Map<ComponentTypes, SheetComponentValue>([
  [
    ComponentTypes.TEXT,
    {
      style: JSON.stringify({
        ...JSON.parse(defaultSheetEmptyValue.style),
        color: '#FAF7F2',
      }),
      data: JSON.stringify({
        value: 'Text',
        autoScale: true,
      }),
    },
  ],
  [ComponentTypes.IMAGE, { ...defaultSheetEmptyValue, data: JSON.stringify({ url: '' }) }],
  [
    ComponentTypes.SHAPE,
    {
      data: JSON.stringify({ sides: 4 }),
      style: JSON.stringify({
        ...JSON.parse(defaultSheetEmptyValue.style),
        backgroundColor: '#42403D',
      }),
    },
  ],
  [
    ComponentTypes.INPUT,
    {
      style: JSON.stringify({
        ...JSON.parse(defaultSheetEmptyValue.style),
        backgroundColor: '#42403D',
        color: '#FAF7F2',
      }),
      data: JSON.stringify({
        value: '',
        type: 'number',
      }),
    },
  ],
  [
    ComponentTypes.CHECKBOX,
    {
      style: JSON.stringify({
        ...JSON.parse(defaultSheetEmptyValue.style),
        color: '#FAF7F2',
      }),
      data: JSON.stringify({
        value: 'false',
        type: 'checkbox',
        label: '',
        labelPlacement: 'right',
        imageIfChecked: '',
        imageIfUnchecked: '',
      }),
    },
  ],
  [
    ComponentTypes.CANVAS,
    {
      data: '{}',
      style: JSON.stringify({
        ...JSON.parse(defaultSheetEmptyValue.style),
        backgroundColor: '#42403D',
      }),
    },
  ],
  [
    ComponentTypes.LINE,
    {
      style: JSON.stringify({
        ...JSON.parse(defaultSheetEmptyValue.style),
        color: '#FAF7F2',
      }),
      data: JSON.stringify({
        strokeWidth: 2,
        strokeColor: '#FAF7F2',
        index: 0,
        fillShape: false,
      }),
    },
  ],
  [
    ComponentTypes.NOTES,
    {
      data: JSON.stringify({
        editorLocked: true,
        content: defaultNoteComponentContent,
      }),
      style: JSON.stringify({
        ...JSON.parse(defaultSheetEmptyValue.style),
        backgroundColor: '#2A2A2A',
        color: '#FAF7F2',
      }),
    },
  ],
  [
    ComponentTypes.CONTENT,
    {
      data: JSON.stringify({
        editorLocked: false,
        content: defaultContentComponentContent,
      }),
      style: JSON.stringify({
        ...JSON.parse(defaultSheetEmptyValue.style),
        backgroundColor: '#2A2A2A',
        color: '#FAF7F2',
      }),
    },
  ],
  [
    ComponentTypes.CHART,
    {
      data: JSON.stringify({
        chartId: '',
        rulesetId: '',
        headerBgColor: '',
        evenRowBgColor: '',
        oddRowBgColor: '',
        tableOutlineColor: '',
        rowVerticalSpacing: '',
        rowHorizontalSpacing: '',
      }),
      style: JSON.stringify({
        ...JSON.parse(defaultSheetEmptyValue.style),
        backgroundColor: '#42403D',
        color: '#FAF7F2',
      }),
    },
  ],
  [
    ComponentTypes.PDF,
    {
      style: JSON.stringify({
        ...JSON.parse(defaultSheetEmptyValue.style),
        color: '#FAF7F2',
      }),
      data: JSON.stringify({
        fileSrc: '',
        pageNumber: 1,
        autoScale: false,
      }),
    },
  ],
  [
    ComponentTypes.GRAPH,
    {
      style: JSON.stringify({
        ...JSON.parse(defaultSheetEmptyValue.style),
        color: '#417090',
        backgroundColor: '#42403D',
      }),
      data: '{}',
    },
  ],
  [
    ComponentTypes.FRAME,
    {
      style: JSON.stringify({
        ...JSON.parse(defaultSheetEmptyValue.style),
        color: '#417090',
        backgroundColor: '#42403D',
      }),
      data: JSON.stringify({ url: '' }),
    },
  ],
  [
    ComponentTypes.INVENTORY,
    {
      style: JSON.stringify({
        ...JSON.parse(defaultSheetEmptyValue.style),
        backgroundColor: '#42403D',
      }),
      data: JSON.stringify({ slotKeys: '' }),
    },
  ],
  [
    ComponentTypes.ARCHETYPE,
    {
      style: JSON.stringify({ ...JSON.parse(defaultSheetEmptyValue.style) }),
      data: JSON.stringify({
        points: [
          {
            connectionPointId: '1',
            connectionColor: 'red',
            connectionX: 0,
            connectionY: 0,
          },
        ],
      }),
    },
  ],
]);

const commonEditableTypes = ['layer'];

export const editableValuesByType = new Map<ComponentTypes, string[]>([
  [ComponentTypes.TEXT, [...commonEditableTypes, 'color', 'opacity']],
  [ComponentTypes.LINE, [...commonEditableTypes]],
  [
    ComponentTypes.INPUT,
    [...commonEditableTypes, 'backgroundColor', 'color', 'opacity', 'borderRadius'],
  ],
  [ComponentTypes.IMAGE, [...commonEditableTypes, 'borderRadius', 'opacity']],
  [ComponentTypes.SHAPE, [...commonEditableTypes, 'backgroundColor', 'borderRadius', 'opacity']],
  [ComponentTypes.CHECKBOX, [...commonEditableTypes, 'color', 'borderRadius', 'opacity']],
  [ComponentTypes.CANVAS, [...commonEditableTypes, 'backgroundColor', 'borderRadius', 'opacity']],
  [
    ComponentTypes.NOTES,
    [...commonEditableTypes, 'backgroundColor', 'color', 'opacity', 'borderRadius'],
  ],
  [
    ComponentTypes.CONTENT,
    [...commonEditableTypes, 'backgroundColor', 'color', 'opacity', 'borderRadius'],
  ],
  [
    ComponentTypes.CHART,
    [...commonEditableTypes, 'backgroundColor', 'color', 'opacity', 'borderRadius'],
  ],
  [ComponentTypes.PDF, [...commonEditableTypes, 'opacity', 'borderRadius']],
  [
    ComponentTypes.GRAPH,
    [...commonEditableTypes, 'opacity', 'borderRadius', 'color', 'backgroundColor'],
  ],
  [ComponentTypes.FRAME, [...commonEditableTypes, 'opacity', 'borderRadius']],
  [
    ComponentTypes.INVENTORY,
    [...commonEditableTypes, 'opacity', 'borderRadius', 'backgroundColor'],
  ],
]);
