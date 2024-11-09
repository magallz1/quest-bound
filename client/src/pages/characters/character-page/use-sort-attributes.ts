import { ContextualAttribute } from '@/libs/compass-api';

export const useSortAttributes = (
  attributes: ContextualAttribute[],
  sortValue: 'Alphabetical' | 'Archetype' | 'Type',
) => {
  const sortAlphabetical = (a: ContextualAttribute, b: ContextualAttribute) => {
    return a.name.localeCompare(b.name);
  };
  const sortArchetype = (a: ContextualAttribute, b: ContextualAttribute) => {
    return a.source.localeCompare(b.source);
  };
  const sortType = (a: ContextualAttribute, b: ContextualAttribute) => {
    return b.type.localeCompare(a.type);
  };

  const sortAttributes = (data: ContextualAttribute[]) => {
    switch (sortValue) {
      case 'Alphabetical':
        return data.sort(sortAlphabetical);
      case 'Archetype':
        return data.sort(sortArchetype);
      case 'Type':
        return data.sort(sortType);
      default:
        return data;
    }
  };

  return {
    attributes: sortAttributes(attributes) as ContextualAttribute[],
  };
};
