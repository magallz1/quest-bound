import { character } from './character';
import { characters } from './characters';
import { createCharacter } from './create-character';
import { deleteCharacter } from './delete-character';
import { updateCharacter } from './update-character';

export const characterResolvers = {
  Query: {
    characters,
    character,
  },
  Mutation: {
    createCharacter,
    updateCharacter,
    deleteCharacter,
  },
};
