import { AuthorizationContext } from '@/infrastructure/types';
import { DeleteDocumentMutationVariables } from '../../generated-types';
import { dbClient, supabaseClient } from '@/database';
import { convertEntityId, throwIfUnauthorized } from '../_shared';

export const deleteDocument = async (
  parent: any,
  args: DeleteDocumentMutationVariables,
  context: AuthorizationContext,
) => {
  const { userPermittedRulesetWriteIds, userPermittedRulesetReadIds } = context;

  const { input } = args;

  const db = dbClient();
  const supabase = supabaseClient();

  const { fromEntity } = convertEntityId(input.rulesetId);

  throwIfUnauthorized({
    rulesetId: input.rulesetId,
    userPermittedRulesetWriteIds,
    userPermittedRulesetReadIds,
    role: 'write',
  });

  const rs = await db.ruleset.findUnique({
    where: {
      id: input.rulesetId,
    },
  });

  const document = await db.document.findUnique({
    where: {
      id: fromEntity(input.id),
    },
  });

  if (document?.fileKey) {
    // Only delete the associated file if this is an original ruleset
    // Rulesets made from published rulesets will reference the same master file
    if (!rs?.publishedRulesetId && !document.moduleId) {
      const { error } = await supabase.storage.from('documents').remove([document.fileKey]);

      if (error) {
        throw Error(error.message);
      }
    }
  }

  await db.document.delete({
    where: {
      id: fromEntity(input.id),
    },
  });

  return `Successfully deleted document ${input.id}`;
};
