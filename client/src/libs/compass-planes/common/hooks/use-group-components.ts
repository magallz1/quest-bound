import { SheetComponent, UpdateSheetComponent } from '@/libs/compass-api';
import { generateId } from '@/libs/compass-web-utils';
import { useEditorStore } from '../editor-store';

export const useGroupComponents = (sheetId: string) => {
  const { updateComponents } = useEditorStore();

  const handleUngroup = (selections: SheetComponent[]) => {
    updateComponents({ sheetId, updates: ungroupComponents(selections) });
  };

  const handleGroup = (selections: SheetComponent[]) => {
    updateComponents({ sheetId, updates: groupComponents(selections) });
  };

  return {
    handleGroup,
    handleUngroup,
  };
};

/**
 * Applies the same groupId to all provided components.
 */
const groupComponents = (
  components: SheetComponent[],
): Omit<UpdateSheetComponent, 'rulesetId'>[] => {
  if (components.length < 1) return [];

  const groupId = generateId();

  return components.map((comp) => ({
    id: comp.id,
    sheetId: comp.sheetId,
    groupId,
  }));
};

/**
 * Removes the groupId of all provided components.
 */
const ungroupComponents = (
  components: SheetComponent[],
): Omit<UpdateSheetComponent, 'rulesetId'>[] => {
  return components.map((comp) => ({
    id: comp.id,
    sheetId: comp.sheetId,
    groupId: null,
  }));
};
