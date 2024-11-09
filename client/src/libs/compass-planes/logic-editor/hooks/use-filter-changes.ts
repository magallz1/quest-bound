import { Operation, OperationType } from '../types';

const operationsWhichShouldNotBeRemoved: OperationType[] = [];

export const useFilterChanges = (getOperation: (id: string) => Operation | undefined) => {
  function filterChanges(changes: Array<any>): any[] {
    return changes.filter((change) => {
      if (change.type === 'remove') {
        const operation = getOperation(change.id);
        if (operation && operationsWhichShouldNotBeRemoved.includes(operation?.type)) return false;
      }

      return true;
    });
  }

  return {
    filterChanges,
  };
};
