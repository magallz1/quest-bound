import { AuthorizationContext, ResolverInput } from '@/infrastructure/types';
import { dbClient } from '@/database';
import { UpdateArchetype } from '../../generated-types';
import { convertEntityId, throwIfUnauthorized } from '../_shared';

export const updateArchetype = async (
  parent: any,
  args: ResolverInput<UpdateArchetype>,
  context: AuthorizationContext,
) => {
  const { userPermittedRulesetWriteIds, userPermittedRulesetReadIds } = context;

  const { input } = args;

  const db = dbClient();
  const { fromEntity } = convertEntityId(input.rulesetId);

  throwIfUnauthorized({
    rulesetId: input.rulesetId,
    userPermittedRulesetWriteIds,
    userPermittedRulesetReadIds,
    role: 'write',
  });

  const archetype = await db.archetype.update({
    where: {
      id: fromEntity(input.id),
    },
    data: {
      title: input.title ?? undefined,
      description: input.description ?? undefined,
      category: input.category ?? undefined,
      imageId: input.imageId,
    },
    include: {
      image: true,
      ruleset: {
        include: {
          user: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  return {
    ...archetype,
    id: archetype.entityId,
  };
};
