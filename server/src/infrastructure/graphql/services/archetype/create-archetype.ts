import { AuthorizationContext, ResolverInput } from '@/infrastructure/types';
import { dbClient } from '@/database';
import { v4 as uuidv4 } from 'uuid';
import { CreateArchetype } from '../../generated-types';
import { convertEntityId, throwIfUnauthorized } from '../_shared';

export const createArchetype = async (
  parent: any,
  args: ResolverInput<CreateArchetype>,
  context: AuthorizationContext,
) => {
  const { userPermittedRulesetReadIds, userPermittedRulesetWriteIds } = context;

  const { input } = args;

  const db = dbClient();
  const { fromEntity } = convertEntityId(input.rulesetId);

  const entityId = uuidv4();

  throwIfUnauthorized({
    rulesetId: input.rulesetId,
    userPermittedRulesetWriteIds,
    userPermittedRulesetReadIds,
    role: 'write',
  });

  const archetype = await db.archetype.create({
    data: {
      ...input,
      id: fromEntity(entityId),
      entityId,
      title: input.title ?? undefined,
      category: input.category ?? undefined,
      description: input.description ?? undefined,
      moduleId: input.moduleId ?? undefined,
      imageId: input.imageId ?? undefined,
    },
  });

  return {
    ...archetype,
    id: archetype.entityId,
  };
};
