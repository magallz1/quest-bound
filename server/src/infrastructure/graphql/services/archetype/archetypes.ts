import { AuthorizationContext } from '@/infrastructure/types';
import { dbClient } from '@/database';
import { ArchetypesQueryVariables } from '../../generated-types';
import { throwIfUnauthorized } from '../_shared';

export const archetypes = async (
  parent: any,
  args: ArchetypesQueryVariables,
  context: AuthorizationContext,
) => {
  const {
    userPermittedRulesetReadIds,
    userPermittedRulesetWriteIds,
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

  const getArchetype = async () => {
    if (published) {
      return await db.publishedArchetype.findMany({
        where: {
          rulesetId,
        },
        include: {
          image: true,
        },
      });
    }
    return await db.archetype.findMany({
      where: {
        rulesetId,
      },
      include: {
        image: true,
        ruleset: {
          select: {
            user: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });
  };

  const archetypes = await getArchetype();

  if (!archetypes) {
    throw Error('Archetypes not found.');
  }

  if (!published) {
    const archetypeChart = await db.chart.findUnique({
      where: {
        id: `archetypes-${rulesetId}`,
      },
    });

    if (!archetypeChart) {
      await db.chart.create({
        data: {
          id: `archetypes-${rulesetId}`,
          rulesetId,
          data: [[]],
          fileKey: '',
          title: `Archetype Chart ${rulesetId}`,
        },
      });
    }
  }

  return archetypes.map((archetype: any) => ({
    ...archetype,
    id: archetype.entityId,
  }));
};
