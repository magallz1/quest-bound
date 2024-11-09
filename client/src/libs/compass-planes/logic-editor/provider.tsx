import { Attribute, ContextualItem, CreateAttribute } from '@/libs/compass-api';
import { createContext } from 'react';
import { Coordinates, EvaluationError, Logic, Operation, OperationType } from '../index';

type LogicContextValue = {
  attribute?: Attribute | null;
  errors: EvaluationError[];
  evaluatedLogic: Logic;
  updateOperation: (update: Partial<Operation> & { id: string }) => void;
  addOperation: (
    type: OperationType,
    coordinates: Coordinates,
    initialData?: Partial<Operation>,
  ) => void;
  getOperation: (id: string) => Operation | undefined;
  getAttribute: (id?: string | null) => Attribute | undefined;
  getItem: (id?: string | null) => ContextualItem | undefined;
  overrideOperation: (override: { id: string; value: string }) => void;
  promoteToAttribute: (
    operation: Operation,
    details: Omit<CreateAttribute, 'rulesetId'>,
  ) => Promise<string>;
  showResultsOnNodes?: boolean;
};

export const LogicContext = createContext<LogicContextValue>({} as LogicContextValue);

export const LogicProvider = LogicContext.Provider;
