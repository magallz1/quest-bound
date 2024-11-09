import {
  Balance,
  DoubleArrow,
  ExitToApp,
  Numbers,
  OpenInNew,
  OpenInNewOff,
  Output,
  RadioButtonChecked,
} from '@mui/icons-material';
import { ReactNode } from 'react';
import { HandleProps, Position } from 'reactflow';
import { IOType, OperationType } from '../types';

export const ioTypeToColor = new Map<IOType, string>([
  [IOType.Input, '#417090'],
  [IOType.Output, '#417090'],
  [IOType.Describe, '#FAF7F2'],
  [IOType.Condition, '#D5A658'],
  [IOType.ChartFilter, '#D5A658'],
  [IOType.OutputIfTrue, '#36A800'],
  [IOType.OutputIfFalse, '#E74323'],
]);

export const ioTypeToIcon = new Map<IOType, ReactNode>([
  [IOType.Input, <ExitToApp sx={{ pointerEvents: 'none' }} fontSize='small' />],
  [IOType.Output, <Output sx={{ pointerEvents: 'none' }} fontSize='small' />],
  [IOType.Describe, <Numbers sx={{ pointerEvents: 'none' }} fontSize='small' />],
  [IOType.Condition, <Balance sx={{ pointerEvents: 'none' }} fontSize='small' />],
  [IOType.ChartFilter, <Balance sx={{ pointerEvents: 'none' }} fontSize='small' />],
  [
    IOType.OutputIfTrue,
    <OpenInNew
      sx={{ rotate: '45deg', pointerEvents: 'none', color: '#36A800' }}
      fontSize='small'
    />,
  ],
  [
    IOType.OutputIfFalse,
    <OpenInNewOff
      sx={{ rotate: '45deg', pointerEvents: 'none', color: '#E74323' }}
      fontSize='small'
    />,
  ],
  [IOType.Parameter, <RadioButtonChecked sx={{ pointerEvents: 'none' }} fontSize='small' />],
  [IOType.Execute, <DoubleArrow sx={{ pointerEvents: 'none' }} fontSize='small' />],
]);

export type IOHandle = HandleProps & {
  ioType: IOType;
  top?: number;
  bottom?: number;
};

export const standardIO: IOHandle[] = [
  { position: Position.Left, type: 'target', ioType: IOType.Input },
  { position: Position.Right, type: 'source', ioType: IOType.Output },
];

export const outputOnlyIO: IOHandle[] = [
  { position: Position.Right, type: 'source', ioType: IOType.Output },
];

export const inputOnlyIO: IOHandle[] = [
  { position: Position.Left, type: 'target', ioType: IOType.Input },
];

export const operationTypeToIOPlacement = new Map<OperationType, IOHandle[]>([
  [OperationType.DefaultValue, outputOnlyIO],
  [
    OperationType.Return,
    [
      { position: Position.Left, type: 'target', ioType: IOType.Execute, top: 12 },
      { position: Position.Left, type: 'target', ioType: IOType.Input, top: 45 },
    ],
  ],
  [OperationType.Number, outputOnlyIO],
  [OperationType.Text, outputOnlyIO],
  [OperationType.Boolean, outputOnlyIO],
  [OperationType.Add, standardIO],
  [OperationType.Subtract, standardIO],
  [OperationType.Multiply, standardIO],
  [OperationType.Divide, standardIO],
  [OperationType.Round, standardIO],
  [OperationType.RoundUp, standardIO],
  [OperationType.RoundDown, standardIO],
  [OperationType.Exponent, outputOnlyIO],
  [OperationType.Logarithm, outputOnlyIO],
  [OperationType.Equal, outputOnlyIO],
  [OperationType.NotEqual, outputOnlyIO],
  [OperationType.GreaterThan, outputOnlyIO],
  [OperationType.LessThan, outputOnlyIO],
  [OperationType.GreaterThanOrEqual, outputOnlyIO],
  [OperationType.LessThanOrEqual, outputOnlyIO],
  [OperationType.And, standardIO],
  [OperationType.Or, standardIO],
  [
    OperationType.Set,
    [
      { position: Position.Left, type: 'target', ioType: IOType.Execute, top: 12 },
      { position: Position.Left, type: 'target', ioType: IOType.Input, top: 44 },
      { position: Position.Right, type: 'source', ioType: IOType.Output },
    ],
  ],
  [
    OperationType.If,
    [
      { position: Position.Left, type: 'target', ioType: IOType.Input, top: 16 },
      { position: Position.Left, type: 'target', ioType: IOType.Condition, top: 61 },
      { position: Position.Right, type: 'source', ioType: IOType.OutputIfTrue, top: 16 },
      { position: Position.Right, type: 'source', ioType: IOType.OutputIfFalse, top: 61 },
    ],
  ],
  [OperationType.Not, standardIO],
  [OperationType.Attribute, outputOnlyIO],
  [OperationType.Action, outputOnlyIO],
  [
    OperationType.ChartRef,
    [
      { position: Position.Right, type: 'source', ioType: IOType.Output, top: 20 },
      { position: Position.Right, type: 'source', ioType: IOType.ChartFilter, top: 215 },
    ],
  ],
  [OperationType.Ability, outputOnlyIO],
  [OperationType.GetItem, outputOnlyIO],
  [OperationType.Inventory, outputOnlyIO],
  [
    OperationType.SetItem,
    [
      { position: Position.Left, type: 'target', ioType: IOType.Execute, top: 20 },
      { position: Position.Left, type: 'target', ioType: IOType.Input, top: 60 },
    ],
  ],
  [OperationType.Variable, standardIO],
  [
    OperationType.SideEffect,
    [
      { position: Position.Left, type: 'target', ioType: IOType.Execute, top: 20 },
      { position: Position.Left, type: 'target', ioType: IOType.Input, top: 90 },
    ],
  ],
  [
    OperationType.Dice,
    [
      { position: Position.Left, type: 'target', ioType: IOType.Describe },
      { position: Position.Right, type: 'source', ioType: IOType.Output },
    ],
  ],
  [
    OperationType.Announce,
    [
      { position: Position.Left, type: 'target', ioType: IOType.Execute, top: 18 },
      { position: Position.Left, type: 'target', ioType: IOType.Input, top: 65 },
    ],
  ],
]);
