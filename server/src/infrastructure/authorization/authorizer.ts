import { dbClient } from '@/database';
import { AuthorizationContext } from '../types';
import { GraphQLError } from 'graphql';
import { AuthorizerParams } from './types';
import { getCache } from '../cache';
import { UserRole } from '../graphql';
import { verifyToken } from './utils';

// For personal use and self hosting, this can be set to false.
// Otherwise, set to true and implement your auth logic.
const AUTHORIZATION_REQUIRED = false;

/**
 * Call before every GraphQL request, providing the user ID and permissions as context to each resolver.
 */
export const authorizer = async ({
  token,
  optionalAuth = false,
  ignoreCache = false,
}: AuthorizerParams): Promise<AuthorizationContext> => {
  const authToken = token ?? '';
  let userId = !AUTHORIZATION_REQUIRED ? authToken.replace('Bearer ', '').trim() : '';

  // For routes that don't require authentication
  if (optionalAuth && AUTHORIZATION_REQUIRED) {
    return {
      userId,
      userRole: UserRole.USER,
      userPermittedRulesetWriteIds: [],
      userPermittedRulesetReadIds: [],
      userPermittedPublishedRulesetReadIds: [],
    };
  }

  if ((!token || token === 'Bearer null') && AUTHORIZATION_REQUIRED && !optionalAuth) {
    throw new GraphQLError('User is not authenticated', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 },
      },
    });
  }

  if (!AUTHORIZATION_REQUIRED && !token) {
    throw Error('Must provide user ID as token when authorization is not required');
  }

  const cache = getCache();
  const db = dbClient();

  const userPermittedRulesetWriteIds: string[] = [];
  const userPermittedRulesetReadIds: string[] = [];
  const userPermittedPublishedRulesetReadIds: string[] = [];

  const user: { id: string; email: string } = AUTHORIZATION_REQUIRED
    ? verifyToken(authToken)
    : {
        id: userId,
        email: '',
      };

  const cachedUser = cache.get(user.id);

  if (cachedUser && !ignoreCache) return cachedUser as AuthorizationContext;

  const currentUser = await db.user.findUnique({
    where: {
      id: user.id,
    },
    include: {
      rulesets: {
        select: {
          id: true,
        },
      },
      rulesetPermissions: true,
      playTesters: {
        include: {
          ruleset: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  // New users are bootstrapped in the restful signin API
  if (!currentUser) {
    throw new GraphQLError('Unable to retrieve user', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 500 },
      },
    });
  }

  const officialContent = await db.officialContent.findMany({
    where: {
      type: {
        not: 'empty',
      },
    },
  });

  for (const content of officialContent) {
    userPermittedPublishedRulesetReadIds.push(content.entityId);
  }

  userId = currentUser.id;
  userPermittedRulesetReadIds.push(
    ...currentUser.playTesters.map((playTester: any) => playTester.ruleset.id),
  );
  userPermittedRulesetWriteIds.push(...currentUser.rulesets.map((ruleset: any) => ruleset.id));
  userPermittedPublishedRulesetReadIds.push(
    ...currentUser.rulesetPermissions.map((rulesetPermission: any) => rulesetPermission.rulesetId),
  );

  cache.set(
    user.id,
    {
      userId,
      userRole: currentUser.role as UserRole,
      userPermittedRulesetWriteIds,
      userPermittedRulesetReadIds,
      userPermittedPublishedRulesetReadIds,
    },
    60 * 60 * 1,
  ); // 1 hour

  return {
    userId,
    userRole: currentUser.role as UserRole,
    userPermittedRulesetWriteIds,
    userPermittedRulesetReadIds,
    userPermittedPublishedRulesetReadIds,
    authorizationRequired: AUTHORIZATION_REQUIRED,
  };
};
