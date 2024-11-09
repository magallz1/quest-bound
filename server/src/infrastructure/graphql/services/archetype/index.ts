import { archetype } from './archetype';
import { archetypes } from './archetypes';
import { createArchetype } from './create-archetype';
import { deleteArchetype } from './delete-archetype';
import { updateArchetype } from './update-archetype';

export const archetypeResolvers = {
  Query: {
    archetype,
    archetypes,
  },
  Mutation: {
    createArchetype,
    updateArchetype,
    deleteArchetype,
  },
};
