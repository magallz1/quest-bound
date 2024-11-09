import { Logic, Operation } from '@/libs/compass-planes';

export function injectArgumentsInActionLogic(callingLogic: Logic, actionLogic: Logic): Logic {
  const paramterMap = new Map<string, Operation>();

  for (const actionOp of actionLogic) {
    for (const callingOp of callingLogic) {
      if (callingOp.connections.some((conn) => conn.targetType.includes(actionOp.id))) {
        paramterMap.set(actionOp.id, callingOp);
      }
    }
  }

  let injectedActionLogic = [...actionLogic];

  // Create a new operation for each parameter so the action logic params can reference their values
  for (const variableOp of injectedActionLogic.filter((op) => op.type === 'variable')) {
    if (paramterMap.has(variableOp.id)) {
      const param = paramterMap.get(variableOp.id);
      if (param) {
        injectedActionLogic = injectedActionLogic.map((op) => {
          if (op.id === variableOp.id) {
            return {
              ...op,
              data: {
                ...op.data,
                parameterValue: param.value,
              },
            };
          }
          return op;
        });
      }
    }
  }

  return injectedActionLogic;
}
