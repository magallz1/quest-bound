import { AuthorizationContext } from '@/infrastructure/types';
import { DeleteSheetMutationVariables } from '../../generated-types';
import { dbClient } from '@/database';

export const deleteSheet = async (
  parent: any,
  args: DeleteSheetMutationVariables,
  context: AuthorizationContext,
) => {
  const { id, rulesetId } = args.input;

  // TODO: Query for any sheets made from template and return num in response
  // Client can delete template images if no sheets have been made from it.

  const db = dbClient();

  // You many only delete sheets you own
  const existingSheet = await db.sheet.findUnique({
    where: {
      id: `${id}-${rulesetId}`,
    },
  });

  if (!existingSheet) {
    throw Error('Sheet not found.');
  }

  await db.sheet.delete({
    where: {
      id: existingSheet.id,
    },
  });

  return `Successfully deleted sheet ${id}`;
};
