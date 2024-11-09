import { AuthorizationContext } from '@/infrastructure/types';
import { DocumentsQueryVariables } from '../../generated-types';
import { dbClient } from '@/database';
import { throwIfUnauthorized } from '../_shared';

export const documents = async (
  parent: any,
  args: DocumentsQueryVariables,
  context: AuthorizationContext,
) => {
  const {
    userPermittedRulesetWriteIds,
    userPermittedRulesetReadIds,
    userPermittedPublishedRulesetReadIds,
  } = context;

  const { rulesetId } = args;

  const db = dbClient();

  const published = throwIfUnauthorized({
    rulesetId,
    userPermittedRulesetWriteIds,
    userPermittedRulesetReadIds,
    userPermittedPublishedRulesetReadIds,
  });

  const query = {
    where: {
      rulesetId,
    },
    include: {
      ruleset: {
        select: {
          userId: true,
        },
      },
    },
  };

  const getDocuments = async () => {
    return published
      ? await db.publishedDocument.findMany(query)
      : await db.document.findMany(query);
  };

  const documents = await getDocuments();

  return documents.map((document: any) => ({
    ...document,
    id: document.entityId,
  }));
};
