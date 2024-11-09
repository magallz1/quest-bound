import { createContext } from 'react';
import { Archetype } from '../gql';
import { useArchetype, useChart } from '../hooks';

type IArchetypeontext = {
  archetype?: Archetype | null;
  archetypeOverrideMap: Map<string, string>;
};

export const ArchetypeContext = createContext<IArchetypeontext>(null!);

/**
 * Wraps rulebook pages to provide components with archetype data for text and image replacement
 */
export const ArchetypeProvider = ArchetypeContext.Provider;

export const useArchetypeState = (archetypeId?: string | null): IArchetypeontext => {
  const { archetype } = useArchetype(archetypeId ?? '');

  const { chart } = useChart('archetypes');

  const chartData = chart?.data ?? [['[]']];

  const archetypeOverrides = JSON.parse(chartData[0][0] ?? '[]');
  const thisArchetypeOverrides = archetypeOverrides.find((a: any) => a.id === archetypeId) ?? {
    value: {},
  };

  const archetypeOverrideMap = new Map<string, string>();

  for (const [key, value] of Object.entries(thisArchetypeOverrides.value)) {
    archetypeOverrideMap.set(key, value as string);
  }

  return {
    archetype,
    archetypeOverrideMap,
  };
};
