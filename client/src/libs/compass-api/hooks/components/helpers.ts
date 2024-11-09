import { generateId } from '@/libs/compass-web-utils';
import { SheetComponent } from '../../gql';

/**
 * Clones components with generated IDs.
 * Maintains grouped relationships and line connections.
 */
export const cloneRawComponents = (components: SheetComponent[]): SheetComponent[] => {
  const oldIdsToNewIds = new Map<string, string>();
  const componentsWithOriginalIds = [...components];

  components.forEach((comp) => oldIdsToNewIds.set(comp.id, generateId()));

  // Store groupId and for each logical operand with a component type, store refId
  componentsWithOriginalIds.forEach((comp) => {
    if (!!comp.groupId && !oldIdsToNewIds.has(comp.groupId)) {
      oldIdsToNewIds.set(comp.groupId, generateId());
    }

    const componentData = JSON.parse(comp.data);

    // Line Components
    if (!oldIdsToNewIds.has(componentData.connectedId)) {
      oldIdsToNewIds.set(componentData.connectedId, generateId());
    }

    if (!oldIdsToNewIds.has(componentData.connectionId)) {
      oldIdsToNewIds.set(componentData.connectionId, generateId());
    }

    if (!oldIdsToNewIds.has(componentData.pointId)) {
      oldIdsToNewIds.set(componentData.pointId, generateId());
    }
  });

  const optimisticComponents: SheetComponent[] = [];

  componentsWithOriginalIds.forEach((comp) => {
    const componentData = JSON.parse(comp.data);

    optimisticComponents.push({
      ...comp,
      id: oldIdsToNewIds.get(comp.id) ?? comp.id,
      ...(!!comp.groupId && {
        groupId: oldIdsToNewIds.get(comp.groupId) ?? null,
      }),
      data: JSON.stringify({
        ...componentData,
        ...(componentData.connectionId && {
          connectionId: oldIdsToNewIds.get(componentData.connectionId) ?? null,
        }),
        ...(componentData.connectedId && {
          connectedId: oldIdsToNewIds.get(componentData.connectedId) ?? null,
        }),
        ...(componentData.pointId && {
          pointId: oldIdsToNewIds.get(componentData.pointId) ?? null,
        }),
      }),
    });
  });

  return optimisticComponents;
};
