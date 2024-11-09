import { AttributeType } from '@/libs/compass-api';
import { Stack, Text } from '@chakra-ui/react';
import {
  Add as AddIcon,
  ArrowDownward,
  ArrowUpward,
  CompareArrows,
  Remove,
} from '@mui/icons-material';
import { ReactNode } from 'react';

export type LogicalValue = number | string;
export enum ConnectionType {
  DiceSelect = 'dice-select',
  Conditional = 'conditional',
}

export type EvaluationError = {
  message: string;
  operationId: string;
  type: EvaluationErrorType;
  attributeRef?: string | null;
};

export enum EvaluationErrorType {
  Circular = 'Circular',
  TypeMismatch = 'TypeMismatch',
  IncorrectNumberOfArguments = 'IncorrectNumberOfArguments',
  Custom = 'Custom',
}

// IO type is matched to the operation property that holds the reference ID
export enum IOType {
  Input = 'input',
  Output = 'output',
  OutputIfTrue = 'connectionIfTrue',
  OutputIfFalse = 'connectionIfFalse',
  Describe = 'diceSelect',
  Condition = 'conditionalConnection',
  ChartFilter = 'chartRowConnection',
  Parameter = 'parameter',
  Execute = 'execute',
}

export const ioTypes = [
  IOType.Output,
  IOType.Describe,
  IOType.Condition,
  IOType.OutputIfTrue,
  IOType.OutputIfFalse,
  IOType.ChartFilter,
  IOType.Parameter,
  IOType.Execute,
];

export type Connection = {
  id: string;
  sourceType: IOType;
  targetType: IOType;
  data?: any; // Store arbitrary data for the connection, e.g. parameter id
};

export enum OperationType {
  DefaultValue = 'default-value',
  Return = 'return',

  SideEffect = 'side-effects',
  Variable = 'variable',

  // Hold references to other entities
  Attribute = 'attribute',
  ChartRef = 'chart_ref',
  Action = 'action',

  // Items
  Property = 'property',
  GetItem = 'get-item',
  SetItem = 'set-item',
  Ability = 'ability',
  Inventory = 'inventory',

  // Other
  Dice = 'dice',
  Comment = 'comment',
  Announce = 'announce',

  // Mathematical
  Set = 'set',
  Add = 'add',
  Subtract = 'subtract',
  Multiply = 'multiply',
  Divide = 'divide',
  Round = 'round',
  RoundUp = 'roundUp',
  RoundDown = 'roundDown',
  Exponent = 'exponent',
  Logarithm = 'logarithm',

  // Comparative
  Equal = 'equal',
  NotEqual = 'not-equal',
  GreaterThan = 'gt',
  LessThan = 'lt',
  GreaterThanOrEqual = 'gte',
  LessThanOrEqual = 'lte',

  // Conditional
  If = 'if',
  And = 'and',
  Or = 'or',
  Not = 'not',

  // Primitives
  Number = 'number',
  Text = 'text_primitive',
  Boolean = 'boolean',
}

export type Operation = {
  id: string;
  type: OperationType;
  x: number;
  y: number;
  value?: LogicalValue; // Last evaluated or static value
  not?: boolean; // For boolean operations
  data?: any; // Store arbitrary data for the operation, e.g. chart reversal

  connections: Connection[]; // Downstream connection IDs

  attributeRef?: string | null; // Attribute reference ID for attribute types
  chartRef?: string | null; // Chart reference ID

  // Variables for action operations
  variableOperationIds?: string[] | null;
  variableType?: AttributeType;
  variableName?: string;

  chartValueColumnName?: string | null; // The column name of the associated chart from which the value is to be pulled
  chartFilterColumnName?: string | null; // The column name of the associated chart from which the comparison is used to filter for the value
};

export type Logic = Operation[];

export const operationTypeToLabel = new Map<OperationType, string>([
  [OperationType.DefaultValue, 'Default Value'],
  [OperationType.Return, 'Return'],
  [OperationType.Attribute, 'Attribute'],
  [OperationType.Action, 'Action'],
  [OperationType.ChartRef, 'Chart'],
  [OperationType.Variable, 'Variable'],
  [OperationType.SideEffect, 'Side Effect'],

  [OperationType.Property, 'Property'],
  [OperationType.GetItem, 'Get Item'],
  [OperationType.SetItem, 'Set Item'],
  [OperationType.Ability, 'Ability'],
  [OperationType.Inventory, 'Get Inventory'],

  [OperationType.Number, 'Number'],
  [OperationType.Text, 'Text'],
  [OperationType.Boolean, 'Boolean'],

  [OperationType.Set, 'Set'],
  [OperationType.Add, 'Add'],
  [OperationType.Subtract, 'Subtract'],
  [OperationType.Multiply, 'Multiply'],
  [OperationType.Divide, 'Divide'],
  [OperationType.Round, 'Round'],
  [OperationType.RoundUp, 'Round Up'],
  [OperationType.RoundDown, 'Round Down'],
  [OperationType.Exponent, 'Exponent'],
  [OperationType.Logarithm, 'Logarithm'],

  [OperationType.Equal, 'Equal'],
  [OperationType.NotEqual, 'Not Equal'],
  [OperationType.GreaterThan, 'Greater Than'],
  [OperationType.LessThan, 'Less Than'],
  [OperationType.GreaterThanOrEqual, 'Greater Than or Equal'],
  [OperationType.LessThanOrEqual, 'Less Than or Equal'],

  [OperationType.If, 'If'],
  [OperationType.And, 'AND'],
  [OperationType.Or, 'OR'],
  [OperationType.Not, 'NOT'],

  [OperationType.Dice, 'Dice'],
  [OperationType.Comment, 'Comment'],
  [OperationType.Announce, 'Announce'],
]);

export const operationTypeToIcon = new Map<OperationType, ReactNode>([
  [OperationType.Set, 'Set'],
  [OperationType.And, 'AND'],
  [OperationType.Or, 'OR'],
  [OperationType.Add, <AddIcon />],
  [OperationType.Subtract, <Remove />],
  [OperationType.Multiply, <Text>X</Text>],
  [OperationType.Divide, <Text>/</Text>],
  [OperationType.Round, <CompareArrows sx={{ transform: 'rotate(90deg)' }} />],
  [OperationType.RoundUp, <ArrowUpward />],
  [OperationType.RoundDown, <ArrowDownward />],
  [OperationType.Exponent, 'A^B'],
  [
    OperationType.Logarithm,
    <Stack direction='row' gap='2px'>
      <Text>log</Text>
      <Text fontSize='0.8rem' sx={{ position: 'relative', bottom: '-10px' }}>
        B
      </Text>
      <Text>(A)</Text>
    </Stack>,
  ],
  [OperationType.Equal, '='],
  [OperationType.NotEqual, '=/='],
  [OperationType.GreaterThan, '>'],
  [OperationType.LessThan, '<'],
  [OperationType.LessThanOrEqual, '<='],
  [OperationType.GreaterThanOrEqual, '>='],
]);
