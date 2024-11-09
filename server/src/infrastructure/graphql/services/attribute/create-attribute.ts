import { v4 as uuidv4 } from 'uuid';
import { CreateAttribute } from '../../generated-types';
import { AuthorizationContext, ResolverInput } from '@/infrastructure/types';
import { dbClient } from '@/database';
import { throwIfUnauthorized } from '../_shared';

export const createAttribute = async (
  parent: any,
  args: ResolverInput<CreateAttribute>,
  context: AuthorizationContext,
) => {
  const { userPermittedRulesetReadIds, userPermittedRulesetWriteIds } = context;
  const { input } = args;

  const db = dbClient();

  const entityId = uuidv4();

  throwIfUnauthorized({
    rulesetId: input.rulesetId,
    userPermittedRulesetWriteIds,
    userPermittedRulesetReadIds,
    role: 'write',
  });

  const attribute = await db.attribute.create({
    data: {
      ...input,
      id: `${entityId}-${input.rulesetId}`,
      entityId,
      imageId: input.imageId,
      data: input.data ? JSON.parse(input.data) : undefined,
      restraints: input.restraints ?? undefined,
      logic: JSON.stringify([]),
    },
  });

  // Append new attribute to end of list
  const parentSortAttribute = await db.attribute.findFirst({
    where: {
      rulesetId: input.rulesetId,
      sortChildId: null,
      NOT: {
        id: attribute.id,
      },
    },
  });

  if (parentSortAttribute) {
    await db.attribute.update({
      where: {
        id: parentSortAttribute.id,
      },
      data: {
        sortChildId: attribute.entityId,
      },
    });
  }

  return {
    ...attribute,
    id: attribute.entityId,
  };
};
