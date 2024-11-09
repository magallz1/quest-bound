import { AuthorizationContext } from '@/infrastructure/types';
import { DeleteSheetComponentsMutationVariables } from '../../generated-types';
import { dbClient } from '@/database';

export const deleteSheetComponents = async (
  parent: any,
  args: DeleteSheetComponentsMutationVariables,
  context: AuthorizationContext,
) => {
  const { input } = args;

  const db = dbClient();

  await db.sheetComponent.deleteMany({
    where: {
      id: { in: input.map((input) => `${input.id}-${input.sheetId}-${input.rulesetId}`) },
    },
  });

  return `Sheet components deleted successfully.`;
};
