import { dbClient } from '@/database';
import { AuthorizationContext, ResolverInput } from '@/infrastructure/types';
import { convertEntityId, throwIfUnauthorized } from '../_shared';
import { Attribute } from '../../generated-types';
import { syncAttributeLogic } from './utils';

export const attribute = async (
  parent: any,
  args: ResolverInput<Attribute>,
  context: AuthorizationContext,
) => {
  const {
    userPermittedRulesetReadIds,
    userPermittedRulesetWriteIds,
    userPermittedPublishedRulesetReadIds,
  } = context;

  const { input } = args;

  const db = dbClient();
  const { fromEntity } = convertEntityId(input.rulesetId);

  const published = throwIfUnauthorized({
    rulesetId: input.rulesetId,
    userPermittedRulesetWriteIds,
    userPermittedRulesetReadIds,
    userPermittedPublishedRulesetReadIds,
  });

  const query = {
    where: {
      id: fromEntity(input.id),
    },
    include: {
      image: true,
      ruleset: {
        select: {
          userId: true,
        },
      },
    },
  };

  const getAttribute = async () => {
    return published
      ? await db.publishedAttribute.findUnique(query)
      : await db.attribute.findUnique(query);
  };

  const attribute = await getAttribute();

  if (!attribute) {
    throw Error('Attribute not found.');
  }

  return syncAttributeLogic({
    ...attribute,
    source: attribute.moduleTitle,
    id: attribute.entityId,
    data: JSON.stringify(attribute.data),
  });
};
