import { AuthorizationContext } from '@/infrastructure/types';
import { DeletePageMutationVariables } from '../../generated-types';
import { dbClient } from '@/database';

export const deletePage = async (
  parent: any,
  args: DeletePageMutationVariables,
  context: AuthorizationContext,
) => {
  const { userId } = context;
  const { id, rulesetId } = args.input;

  const db = dbClient();

  // You many only delete rulesets you own
  const existingPage = await db.page.findUnique({
    where: {
      id: `${id}-${rulesetId}`,
    },
    include: {
      ruleset: true,
      children: true,
    },
  });

  if (!existingPage) {
    throw Error('Page not found.');
  }

  if (existingPage.ruleset?.userId !== userId) {
    throw Error('Current user is not authorized to delete this page.');
  }

  // If page has children, move them to the deleted page's parent
  const deletedPageParentId = existingPage.parentId;
  await db.page.updateMany({
    where: {
      id: {
        in: existingPage.children.map((child: any) => `${child.id}-${rulesetId}`),
      },
    },
    data: {
      parentId: deletedPageParentId,
    },
  });

  await db.page.delete({
    where: {
      id: `${id}-${rulesetId}`,
    },
  });

  return `Successfully deleted page ${id}`;
};
