import { AuthorizationContext, ResolverInput } from '@/infrastructure/types';
import { UpdateAttribute } from '../../generated-types';
import { dbClient } from '@/database';
import { throwIfUnauthorized } from '../_shared';

export const updateAttribute = async (
  parent: any,
  args: ResolverInput<UpdateAttribute>,
  context: AuthorizationContext,
) => {
  const { userPermittedRulesetReadIds, userPermittedRulesetWriteIds } = context;

  const { input } = args;

  const db = dbClient();

  throwIfUnauthorized({
    rulesetId: input.rulesetId,
    userPermittedRulesetWriteIds,
    userPermittedRulesetReadIds,
    role: 'write',
  });

  const attribute = await db.attribute.update({
    where: {
      id: `${input.id}-${input.rulesetId}`,
    },
    include: {
      image: true,
    },
    data: {
      name: input.name ?? undefined,
      description: input.description,
      imageId: input.imageId,
      data: input.data ? JSON.parse(input.data) : undefined,
      type: input.type ?? undefined,
      restraints: input.restraints ?? undefined,
      defaultValue: input.defaultValue ?? undefined,
      minValue: input.minValue,
      maxValue: input.maxValue,
      category: input.category ?? undefined,
      logic: input.logic ?? undefined,
      sortChildId: input.sortChildId,
    },
  });

  return {
    ...attribute,
    id: attribute.entityId,
  };
};
