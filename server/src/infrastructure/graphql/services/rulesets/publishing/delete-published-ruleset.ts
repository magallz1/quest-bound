import { dbClient } from '@/database';
import { DeleteRuleset } from '@/infrastructure/graphql/generated-types';
import { AuthorizationContext, ResolverInput } from '@/infrastructure/types';

export const deletePublishedRuleset = async (
  parent: any,
  args: ResolverInput<DeleteRuleset>,
  context: AuthorizationContext,
) => {
  const { userId } = context;

  const { id } = args.input;
  const db = dbClient();

  // You many only delete rulesets you own
  const existingRuleset = await db.ruleset.findUnique({
    where: {
      id,
    },
  });

  if (!existingRuleset) {
    throw Error('Ruleset not found.');
  }

  if (existingRuleset.userId !== userId) {
    throw Error('Unauthorized');
  }

  await db.publishedRuleset.delete({
    where: {
      id,
    },
  });

  return `Successfully deleted ruleset ${id}`;
};
