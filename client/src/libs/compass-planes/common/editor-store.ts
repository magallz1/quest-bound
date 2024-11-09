import {
  CreateComponents,
  SheetComponent,
  UpdateComponentInput,
  UpdateComponentsInput,
} from '@/libs/compass-api';
import { create } from 'zustand';
import { PlaneEditorType } from '../types';

type EditorState = {
  sheetId: string;
  editorType: PlaneEditorType;
  components: SheetComponent[];
  componentMap: Map<string, string>;
  selectedComponentIds: string[];
  getSelectedComponentIds: () => string[];
  viewMode: boolean;
  streamMode: boolean;
  cacheOnly: boolean;
  getComponent: (componentId?: string | null) => SheetComponent | null;
  getComponentFromMap: (componentId?: string | null) => string | null;
  isSelected: (componentId: string) => boolean;
  updateComponent: (input: UpdateComponentInput, ignoreLock?: boolean) => Promise<any>;
  updateComponents: (input: UpdateComponentsInput, ignoreLock?: boolean) => Promise<any>;
  createComponents: (input: CreateComponents) => Promise<string>;
  /**
   * Update a single component from anywhere in the app.
   */
  updateComponentInMap: (componentId: string, update: any) => void;
  //
  setSheetId: (sheetId: string) => void;
  setCacheOnly: (cacheOnly: boolean) => void;
  setEditorType: (editorType: PlaneEditorType) => void;
  setViewMode: (viewMode: boolean) => void;
  setStreamMode: (streamMode: boolean) => void;
  setComponents: (components: SheetComponent[]) => void;
  setSelectedComponentIds: (componentIds: string[]) => void;
  setUpdateComponent: (
    updateComponent: (input: UpdateComponentInput, ignoreLock?: boolean) => Promise<any>,
  ) => void;
  setUpdateComponents: (
    updateComponents: (input: UpdateComponentsInput, ignoreLock?: boolean) => Promise<any>,
  ) => void;
  setCreateComponents: (createComponents: (input: CreateComponents) => Promise<string>) => void;
};

export const useEditorStore = create<EditorState>()((set, get) => ({
  sheetId: '',
  editorType: PlaneEditorType.SHEET,
  components: [],
  componentMap: new Map(),
  selectedComponentIds: [],
  viewMode: false,
  streamMode: false,
  cacheOnly: false,
  getComponent: (id?: string | null) => {
    if (!id) return null;
    const component = get().componentMap.get(id);
    return component ? JSON.parse(component) : null;
  },
  getComponentFromMap: (componentId) =>
    componentId ? get().componentMap.get(componentId) ?? null : null,
  isSelected: (componentId) => get().selectedComponentIds.includes(componentId),
  getSelectedComponentIds: () => get().selectedComponentIds,
  updateComponent: async (input, ignoreLock) => {
    return '';
  },
  updateComponents: async (input, ignoreLock) => {
    return '';
  },
  createComponents: async (input) => {
    return '';
  },
  updateComponentInMap: (componentId, update) => {
    const prevMap = get().componentMap;
    const prev = JSON.parse(prevMap.get(componentId) ?? '{}');
    const next = { ...prev, ...update };
    prevMap.set(componentId, JSON.stringify(next));
  },
  //
  setSheetId: (sheetId: string) => set({ sheetId }),
  setEditorType: (editorType: PlaneEditorType) => set({ editorType }),
  setViewMode: (viewMode: boolean) => set({ viewMode }),
  setStreamMode: (streamMode: boolean) => set({ streamMode }),
  setCacheOnly: (cacheOnly: boolean) => set({ cacheOnly }),
  setComponents: (components: SheetComponent[]) => set({ components }),
  setSelectedComponentIds: (componentIds: string[]) => set({ selectedComponentIds: componentIds }),
  setUpdateComponent: (updateComponent) => set({ updateComponent }),
  setUpdateComponents: (updateComponents) => set({ updateComponents }),
  setCreateComponents: (createComponents) => set({ createComponents }),
}));
