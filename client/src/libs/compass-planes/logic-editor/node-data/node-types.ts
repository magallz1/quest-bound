import {
  AbilityNode,
  ActionNode,
  AnnounceNode,
  AttributeNode,
  BooleanComparisonNode,
  ChartNode,
  CommentNode,
  ComparisonNode,
  DefaultValueNode,
  DiceNode,
  ExponentNode,
  GetItemNode,
  IfNode,
  InventoryNode,
  MathOperationNode,
  NotNode,
  PrimitiveNode,
  PropertyNode,
  ReturnNode,
  SetItemNode,
  SetNode,
  SideEffectNode,
  VariableNode,
} from '../nodes';
import { OperationType, operationTypeToLabel } from '../types';
import { nodeDescriptions } from './descriptions';

export type NodeOption = {
  category: string;
  name: string;
  type: OperationType;
  description?: string;
  id?: string; // Use for bootstrapping operations from the context menu
};

export const nodeTypes = {
  [OperationType.DefaultValue]: DefaultValueNode,
  [OperationType.Return]: ReturnNode,
  [OperationType.Set]: SetNode,
  [OperationType.Not]: NotNode,
  [OperationType.And]: BooleanComparisonNode,
  [OperationType.Or]: BooleanComparisonNode,
};

const mathOperationTypes = [
  OperationType.Add,
  OperationType.Subtract,
  OperationType.Multiply,
  OperationType.Divide,
  OperationType.Round,
  OperationType.RoundUp,
  OperationType.RoundDown,
  OperationType.Exponent,
  OperationType.Logarithm,
];

const primitiveTypes = [OperationType.Number, OperationType.Text, OperationType.Boolean];

const comparativeTypes = [
  OperationType.Equal,
  OperationType.NotEqual,
  OperationType.GreaterThan,
  OperationType.LessThan,
  OperationType.GreaterThanOrEqual,
  OperationType.LessThanOrEqual,
];

const referenceTypes = [
  OperationType.Attribute,
  OperationType.Action,
  OperationType.ChartRef,
  OperationType.Variable,
];

const itemTypes = [
  OperationType.Property,
  OperationType.GetItem,
  OperationType.SetItem,
  OperationType.Ability,
  OperationType.Inventory,
];

const otherTypes = [
  OperationType.DefaultValue,
  OperationType.Return,
  OperationType.SideEffect,
  OperationType.Dice,
  OperationType.Comment,
  OperationType.Announce,
];

export const nodeOptions: NodeOption[] = [];

// Primitives
for (const type of primitiveTypes) {
  nodeTypes[type as keyof typeof nodeTypes] = PrimitiveNode;
  nodeOptions.push({ category: 'Primitive', name: operationTypeToLabel.get(type) ?? '', type });
}

// Math
for (const type of mathOperationTypes) {
  if (type === OperationType.Exponent || type === OperationType.Logarithm) {
    nodeTypes[type as keyof typeof nodeTypes] = ExponentNode;
  } else {
    nodeTypes[type as keyof typeof nodeTypes] = MathOperationNode;
  }
  nodeOptions.push({ category: 'Math', name: operationTypeToLabel.get(type) ?? '', type });
}

// Comparisons
for (const type of comparativeTypes) {
  nodeTypes[type as keyof typeof nodeTypes] = ComparisonNode;
  nodeOptions.push({ category: 'Comparative', name: operationTypeToLabel.get(type) ?? '', type });
}

nodeOptions.push({
  category: 'Comparative',
  name: operationTypeToLabel.get(OperationType.And) ?? '',
  type: OperationType.And,
});

nodeOptions.push({
  category: 'Comparative',
  name: operationTypeToLabel.get(OperationType.Or) ?? '',
  type: OperationType.Or,
});

// Control Flow
nodeOptions.push({
  category: 'Control Flow',
  name: operationTypeToLabel.get(OperationType.If) ?? '',
  type: OperationType.If,
});

nodeOptions.push({
  category: 'Control Flow',
  name: operationTypeToLabel.get(OperationType.Set) ?? '',
  type: OperationType.Set,
});

nodeOptions.push({
  category: 'Control Flow',
  name: operationTypeToLabel.get(OperationType.Not) ?? '',
  type: OperationType.Not,
});

// Reference
for (const type of referenceTypes) {
  nodeOptions.push({ category: 'Reference', name: operationTypeToLabel.get(type) ?? '', type });
}

// Item
for (const type of itemTypes) {
  nodeOptions.push({ category: 'Item', name: operationTypeToLabel.get(type) ?? '', type });
}

// Other
for (const type of otherTypes) {
  nodeOptions.push({ category: 'Other', name: operationTypeToLabel.get(type) ?? '', type });
}

// Descriptions
for (const option of nodeOptions) {
  option.description = nodeDescriptions.get(option.type);
}

nodeTypes[OperationType.If as keyof typeof nodeTypes] = IfNode;
nodeTypes[OperationType.Attribute as keyof typeof nodeTypes] = AttributeNode;
nodeTypes[OperationType.Action as keyof typeof nodeTypes] = ActionNode;
nodeTypes[OperationType.ChartRef as keyof typeof nodeTypes] = ChartNode;
nodeTypes[OperationType.SideEffect as keyof typeof nodeTypes] = SideEffectNode;
nodeTypes[OperationType.Property as keyof typeof nodeTypes] = PropertyNode;
nodeTypes[OperationType.GetItem as keyof typeof nodeTypes] = GetItemNode;
nodeTypes[OperationType.SetItem as keyof typeof nodeTypes] = SetItemNode;
nodeTypes[OperationType.Ability as keyof typeof nodeTypes] = AbilityNode;
nodeTypes[OperationType.Inventory as keyof typeof nodeTypes] = InventoryNode;
nodeTypes[OperationType.Variable as keyof typeof nodeTypes] = VariableNode;
nodeTypes[OperationType.Dice as keyof typeof nodeTypes] = DiceNode;
nodeTypes[OperationType.Announce as keyof typeof nodeTypes] = AnnounceNode;
nodeTypes[OperationType.Comment as keyof typeof nodeTypes] = CommentNode;
