/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AuthorizationContext, ResolverInput } from '@/infrastructure/types';
import { dbClient } from '@/database';
import { Archetype } from '../../generated-types';
import { throwIfUnauthorized } from '../_shared';

export const archetype = async (
  parent: any,
  args: ResolverInput<Archetype>,
  context: AuthorizationContext,
) => {
  const {
    userPermittedRulesetReadIds,
    userPermittedRulesetWriteIds,
    userPermittedPublishedRulesetReadIds,
  } = context;

  const { input } = args;

  const db = dbClient();

  const published = throwIfUnauthorized({
    rulesetId: input.rulesetId,
    userPermittedRulesetReadIds,
    userPermittedRulesetWriteIds,
    userPermittedPublishedRulesetReadIds,
  });

  const getArchetype = async () => {
    if (published) {
      return await db.publishedArchetype.findUnique({
        where: {
          id: `${input.id}-${input.rulesetId}`,
        },
      });
    }
    return await db.archetype.findUnique({
      where: {
        id: `${input.id}-${input.rulesetId}`,
      },
      include: {
        image: true,
      },
    });
  };

  const archetype = await getArchetype();

  return {
    ...archetype,
    id: archetype!.entityId,
  };
};
