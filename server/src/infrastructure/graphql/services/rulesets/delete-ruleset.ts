import { AuthorizationContext } from '@/infrastructure/types';
import { DeleteRuleset, DeleteRulesetMutationVariables } from '../../generated-types';
import { dbClient, supabaseClient } from '@/database';

export const deleteRuleset = async (
  parent: any,
  args: DeleteRulesetMutationVariables,
  context: AuthorizationContext,
) => {
  const { userId } = context;

  const { id } = args.input;

  const db = dbClient();
  const supabase = supabaseClient();

  // You many only delete rulesets you own
  const existingRuleset = await db.ruleset.findUnique({
    where: {
      id,
    },
    include: {
      documents: true,
    },
  });

  if (!existingRuleset) {
    throw Error('Ruleset not found.');
  }

  if (existingRuleset.userId !== userId) {
    throw Error('Unauthorized');
  }

  try {
    await db.publishedRuleset.update({
      where: {
        id: existingRuleset.id,
      },
      data: {
        live: false,
      },
    });
  } catch (e: any) {
    //swallow
  }

  // For original rulesets only, delete associated document files
  if (!existingRuleset.publishedRulesetId) {
    await Promise.all(
      existingRuleset.documents.map(async (document: any) => {
        await supabase.storage.from('documents').remove([document.fileKey]);
      }),
    );
  }

  await db.ruleset.delete({
    where: {
      id,
    },
  });

  return `Successfully deleted ruleset ${id}`;
};
