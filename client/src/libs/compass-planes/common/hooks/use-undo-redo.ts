import {
  Action,
  ActionType,
  SheetComponent,
  UpdateComponentsInput,
  useCreateComponent,
  useDeleteComponents,
} from '@/libs/compass-api';
import { useKeyListeners, UtilKeyEvent } from '@/libs/compass-web-utils';
import throttle from 'lodash.throttle';
import { useMemo, useRef, useState } from 'react';

interface UndoRedoProps {
  sheetId: string;
  components: SheetComponent[];
  updateComponents: (input: UpdateComponentsInput) => void;
  cacheOnly?: boolean;
}

const maxActionsLength = 10;

export const useUndoRedo = ({
  sheetId,
  updateComponents,
  components,
  cacheOnly,
}: UndoRedoProps) => {
  const [actions, setActions] = useState<Action[]>([]);

  const { createComponents } = useCreateComponent(cacheOnly);
  const { deleteComponents } = useDeleteComponents(sheetId, cacheOnly);

  const currentAction = useRef<number>(-1);

  const undoAvailable = actions.length > 0 && currentAction.current >= 0;
  const redoAvailable = currentAction.current + 1 < actions.length;

  useKeyListeners({
    onKeyDown: ({ key, meta, shift, control }: UtilKeyEvent) => {
      if (!meta && !control) return;
      if (key.toLowerCase() !== 'z') return;

      if (shift) {
        redo();
      } else {
        undo();
      }
    },
  });

  const debouncedActionSet = useMemo(
    () =>
      throttle(
        (actionUpdate: Action, components: SheetComponent[], actions: Action[]) => {
          const actionDataSnapshot = components.filter((c) =>
            actionUpdate.data.map((u) => u.id).includes(c.id),
          );

          let actionSet = [...actions];

          // Made new action in the middle of the action set
          // Remove all actions after the current action
          if (currentAction.current !== actions.length - 1) {
            actionSet = actionSet.slice(0, currentAction.current - 1);
          }

          actionSet.push({
            ...actionUpdate,
            snapshot: actionDataSnapshot,
          });

          const clampedActionSet = actionSet.slice(
            Math.max(actionSet.length - maxActionsLength, 0),
          );

          currentAction.current = clampedActionSet.length - 1;

          setActions(clampedActionSet);
        },
        2000,
        {
          trailing: true,
        },
      ),
    [],
  );

  const registerAction = (actionUpdate: Action) => {
    debouncedActionSet(actionUpdate, components, actions);
  };

  const undo = () => {
    if (!undoAvailable) {
      return;
    }

    const undoAction = actions[currentAction.current];
    if (!undoAction) return;

    const { snapshot } = undoAction;
    if (!snapshot) return;

    switch (undoAction.type) {
      case ActionType.UPDATE:
        updateComponents({
          sheetId,
          updates: snapshot.map((update) => ({
            id: update.id,
            data: update.data,
            style: update.style,
            x: update.x,
            y: update.y,
            height: update.height,
            width: update.width,
            layer: update.layer,
            locked: update.locked,
            groupId: update.groupId,
          })),
        });

        break;
      case ActionType.DELETE:
        createComponents({
          clone: false, // Do not overwrite IDs
          components: snapshot.map((c) => ({
            ...c,
            sheetId,
          })),
        });
        break;
      case ActionType.CREATE:
        deleteComponents(undoAction.data.map((c) => c.id));
    }

    currentAction.current = Math.max(currentAction.current - 1, -1);
  };

  const redo = () => {
    if (!redoAvailable) {
      return;
    }

    const redoAction = actions[currentAction.current + 1];

    const { data } = redoAction;
    if (!data) return;

    switch (redoAction.type) {
      case ActionType.UPDATE:
        updateComponents({
          sheetId,
          updates: data,
        });

        break;
      case ActionType.DELETE:
        deleteComponents(data.map((c) => c.id));
        break;
      case ActionType.CREATE:
        createComponents({
          clone: false, // Do not overwrite IDs
          components: (data as SheetComponent[]).map((c) => ({
            ...c,
            sheetId,
          })),
        });
    }

    currentAction.current = currentAction.current + 1;
  };

  return {
    registerAction,
    undo,
    redo,
    undoAvailable,
    redoAvailable,
  };
};
