import { OperationType } from '../types';

export const nodeDescriptions = new Map<OperationType, string>([
  [
    OperationType.Attribute,
    'Provides the default value of another attribute with a field to override for testing',
  ],
  [
    OperationType.DefaultValue,
    'Provides the default value of this attribute. Changing the value of this node will change the default value of the attribute',
  ],
  [OperationType.Return, 'Sets the value of this attribute, or returns the value of this action'],
  [
    OperationType.Action,
    'Provides the return value of an action. Use variable nodes to provide arguments to actions. This will not trigger action side effects',
  ],
  [
    OperationType.ChartRef,
    'Provides the value of a cell in a chart given a column selection and comparison statement to filter rows',
  ],
  [
    OperationType.Variable,
    'Provides the result of a statement within this logic only. Provides arguments to actions',
  ],
  [OperationType.Property, 'Define a controllable property for this entity'],
  [OperationType.GetItem, 'Retrieves a property of an item'],
  [OperationType.Inventory, "Get properties of the character's inventory"],
  [OperationType.SetItem, 'Sets a property of an item'],
  [OperationType.Ability, 'Adds an actionable ability to this entity'],
  [OperationType.SideEffect, 'Provides a method of altering the value of another attribute'],

  [OperationType.Number, 'Provides a static number value'],
  [OperationType.Text, 'Provides a static text value'],
  [OperationType.Boolean, 'Provides a static boolean value'],

  [
    OperationType.Set,
    'Passes the first node connected to its input to its output. Use after IF nodes to set values within branches',
  ],
  [OperationType.Not, 'Flips the boolean value of its input'],
  [OperationType.Add, 'Sums two or more numbers'],
  [OperationType.Subtract, 'Subtracts two or more numbers'],
  [OperationType.Multiply, 'Multiplies two or more numbers'],
  [OperationType.Divide, 'Divides two or more numbers'],
  [
    OperationType.Round,
    'Raises or lowers its input to the nearest whole number, whichever is closer. Takes the average of all connected nodes',
  ],
  [
    OperationType.RoundUp,
    'Raises its input to the nearest whole number. Takes the average of all connected nodes',
  ],
  [
    OperationType.RoundDown,
    'Lowers its input to the nearest whole number. Takes the average of all connected nodes',
  ],
  [OperationType.Exponent, 'Returns A raised to the power of B'],
  [
    OperationType.Logarithm,
    'Returns the logarithm of A with base B. If B is not provided, the natural logarithm is used.',
  ],

  [OperationType.Equal, 'Checks if A is equal to B. Returns a boolean'],
  [OperationType.NotEqual, 'Checks if A is not equal to B. Returns a boolean'],
  [OperationType.GreaterThan, 'Checks if A is greater than B. Returns a boolean.'],
  [OperationType.LessThan, 'Checks if A is less than B. Returns a boolean'],
  [OperationType.LessThanOrEqual, 'Checks if A is less than or equal to B. Returns a boolean'],
  [
    OperationType.GreaterThanOrEqual,
    'Checks if A is greater than or equal to B. Returns a boolean',
  ],

  [OperationType.If, 'Splits a statement into two branches based on a condition'],
  [OperationType.And, 'Compares two or more boolean values using the logical AND operator'],
  [OperationType.Or, 'Compares two or more boolean values using the logical OR operator'],

  [
    OperationType.Dice,
    'Provides a random number by rolling n number or dice with m sides, given an attached statement with a formatted result of "ndm", e.g. "2d6"',
  ],
  [OperationType.Comment, 'Places text within the logic editor for development notes'],
  [OperationType.Announce, 'Displays a pop-up message when the condition is true'],
]);
