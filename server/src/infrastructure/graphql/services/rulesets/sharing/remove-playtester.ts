import { dbClient } from '@/database';
import { RemovePlaytester } from '@/infrastructure/graphql/generated-types';
import { AuthorizationContext, ResolverInput } from '@/infrastructure/types';
import { throwIfUnauthorized } from '../../_shared';
import { getCache } from '@/infrastructure/cache';

export const removePlaytester = async (
  parent: any,
  args: ResolverInput<RemovePlaytester>,
  context: AuthorizationContext,
) => {
  const { userId, userPermittedRulesetWriteIds, userPermittedRulesetReadIds } = context;

  const {
    input: { userId: userToRemove, rulesetId },
  } = args;

  const db = dbClient();
  const cache = getCache();

  if (userToRemove !== userId) {
    throwIfUnauthorized({
      rulesetId,
      userPermittedRulesetWriteIds,
      userPermittedRulesetReadIds,
      role: 'write',
    });
  }

  const ruleset = await db.ruleset.findUnique({
    where: {
      id: rulesetId,
    },
    include: {
      playTesters: true,
      user: true,
    },
  });

  if (!ruleset) {
    throw Error('Ruleset not found');
  }

  const existingPlaytester = ruleset.playTesters.find(
    ({ userId: existingUserId }: { userId: string }) => existingUserId === userToRemove,
  );

  if (!existingPlaytester) {
    throw Error('User is not a playtester');
  }

  await db.playTester.delete({
    where: {
      id: existingPlaytester.id,
    },
  });

  await db.character.deleteMany({
    where: {
      userId: userToRemove,
      rulesetId,
    },
  });

  // evict user from cache so permitted rulesets will be refetched
  cache.del(userToRemove);

  return `Succesfully removed ${userToRemove} from ${rulesetId}`;
};
