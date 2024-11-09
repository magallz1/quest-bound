import { ContextualAttribute, ContextualItem } from '@/libs/compass-api';
import { create } from 'zustand';

type AttributeStore = {
  attributes: ContextualAttribute[];
  items: ContextualItem[];
};

export const useAttributeStore = create<AttributeStore>()((set) => ({
  attributes: [],
  items: [],
}));
