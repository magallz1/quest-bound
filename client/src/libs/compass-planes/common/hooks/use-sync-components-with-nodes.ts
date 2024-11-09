import {
  ActionType,
  ComponentTypes,
  SheetComponent,
  UpdateComponentsInput,
  useCreateComponent,
  useDeleteComponents,
  useUpdateComponent,
} from '@/libs/compass-api';
import { useParams } from 'react-router-dom';
import { Node } from 'reactflow';
import { Coordinates } from '../../types';
import { bootstrapSheetComponentFromNodeType } from '../utils';
import { useUndoRedo } from './use-undo-redo';

const skipActionRegistrationTypes = new Set<ComponentTypes>([ComponentTypes.ARCHETYPE]);

interface UseSyncComponentsWithNodesProps {
  sheetId: string;
  tabId: string;
  components: SheetComponent[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
}

/**
 * Provides functions to pass to consumers of ReactFlow. Syncs node movement, deleting and creation with SheetComponents.
 */
export const useSyncComponentsWithNodes = ({
  sheetId,
  tabId,
  components,
  setNodes,
}: UseSyncComponentsWithNodesProps) => {
  const { rulesetId } = useParams();
  const { createComponent } = useCreateComponent();
  const { updateComponents } = useUpdateComponent({
    sheetId,
    debounceTime: 500,
    addFailedUpdateIds: () => {},
    removeFailedUpdateIds: () => {},
  });
  const { deleteComponents } = useDeleteComponents(sheetId);

  const updateComponentsAndNodes = (data: UpdateComponentsInput) => {
    updateComponents(data);
    setNodes((prev) =>
      prev.map((node) => {
        const correspondingUpdate = data.updates.find((update) => update.id === node.id);
        if (!correspondingUpdate) return node;
        return {
          ...node,
          position: {
            x: correspondingUpdate.x ?? node.position.x,
            y: correspondingUpdate.y ?? node.position.y,
          },
        };
      }),
    );
  };

  const { registerAction } = useUndoRedo({
    sheetId,
    components,
    updateComponents: updateComponentsAndNodes,
  });

  const createSheetComponent = (
    type: ComponentTypes,
    coordinates: Coordinates,
    zoom = 1,
    partialComponent?: Partial<SheetComponent>,
  ) => {
    if (!rulesetId) return;
    const component = {
      ...bootstrapSheetComponentFromNodeType({
        id: partialComponent?.id,
        type,
        zoom,
        coordinates: {
          x: Math.floor(coordinates.x),
          y: Math.floor(coordinates.y),
        },
        sheetId,
        rulesetId,
        tabId,
      }),
      ...partialComponent,
    };

    if (!skipActionRegistrationTypes.has(type)) {
      registerAction({
        type: ActionType.CREATE,
        data: [component],
      });
    }

    createComponent({
      clone: false,
      component,
    });
  };

  const updateSheetComponents = (
    nodes: Array<{ id: string; coordinates: Coordinates; height: number; width: number }>,
  ) => {
    const updates = nodes.map(({ id, coordinates, height, width }) => ({
      id,
      tabId,
      ...(height && { height: Math.floor(height) }),
      ...(width && { width: Math.floor(width) }),
      ...(coordinates.x !== undefined && { x: Math.floor(coordinates.x) }),
      ...(coordinates.y !== undefined && { y: Math.floor(coordinates.y) }),
    }));

    registerAction({
      type: ActionType.UPDATE,
      data: updates,
    });

    updateComponents({
      sheetId,
      updates,
    });
  };

  const deleteSheetComponents = (ids: string[]) => {
    const toDelete = components.filter((comp) => ids.includes(comp.id));
    registerAction({
      type: ActionType.DELETE,
      data: toDelete,
    });
    deleteComponents(ids);
  };

  return {
    createSheetComponent,
    updateSheetComponents,
    deleteSheetComponents,
  };
};
