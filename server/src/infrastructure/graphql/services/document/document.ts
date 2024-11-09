import { AuthorizationContext } from '@/infrastructure/types';
import { DocumentQueryVariables } from '../../generated-types';
import { dbClient, supabaseClient } from '@/database';
import { throwIfUnauthorized } from '../_shared';

export const document = async (
  parent: any,
  args: DocumentQueryVariables,
  context: AuthorizationContext,
) => {
  const {
    userPermittedRulesetWriteIds,
    userPermittedRulesetReadIds,
    userPermittedPublishedRulesetReadIds,
  } = context;

  const { input } = args;

  const db = dbClient();
  const supabase = supabaseClient();

  const published = throwIfUnauthorized({
    rulesetId: input.rulesetId,
    userPermittedRulesetWriteIds,
    userPermittedRulesetReadIds,
    userPermittedPublishedRulesetReadIds,
  });

  const query = {
    where: {
      id: `${input.id}-${input.rulesetId}`,
    },
    include: {
      ruleset: {
        select: {
          userId: true,
        },
      },
    },
  };

  const getDocument = async () => {
    return published
      ? await db.publishedDocument.findUnique(query)
      : await db.document.findUnique(query);
  };

  const document = await getDocument();

  if (!document) {
    throw Error('Document not found.');
  }

  const { data, error } = await supabase.storage
    .from('documents')
    .createSignedUrl(document.fileKey, 3600);

  if (error) {
    throw Error(error.message);
  }

  return {
    ...document,
    id: document.entityId,
    fileKey: data?.signedUrl ?? '',
  };
};
