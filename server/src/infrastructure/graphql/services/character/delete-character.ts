import { AuthorizationContext } from '@/infrastructure/types';
import { DeleteCharacterMutationVariables } from '../../generated-types';
import { dbClient } from '@/database';

export const deleteCharacter = async (
  parent: any,
  args: DeleteCharacterMutationVariables,
  context: AuthorizationContext,
) => {
  const { userId } = context;

  const { id } = args;

  const db = dbClient();

  await db.character.delete({
    where: {
      id,
      userId,
    },
  });

  return `Successfully deleted character ${id}`;
};
