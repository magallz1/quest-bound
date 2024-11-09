import { dbClient } from '@/database';
import { AuthorizationContext } from '../types';
import * as jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import { AuthorizerParams } from './types';
import { getCache } from '../cache';
import { UserRole } from '../graphql';

const dbSecret = process.env.SUPABASE_SECRET_KEY ?? '';
const mode = process.env.MODE ?? 'local';

/**
 * Call before every GraphQL request, providing the user ID and permissions as context to each resolver.
 * For users which exist in Supabase auth but not the DB, a new user is created.
 */
export const authorizer = async ({
  token,
  optionalAuth = false,
  ignoreCache = false,
}: AuthorizerParams): Promise<AuthorizationContext> => {
  if (!token || token === 'Bearer null') {
    if (!optionalAuth) {
      throw new GraphQLError('User is not authenticated', {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: { status: 401 },
        },
      });
    } else {
      return {
        userId: '',
        userRole: UserRole.USER,
        userPermittedRulesetWriteIds: [],
        userPermittedRulesetReadIds: [],
        userPermittedPublishedRulesetReadIds: [],
      };
    }
  }

  const cache = getCache();

  const db = dbClient();
  let userId: string = '';
  const userPermittedRulesetWriteIds: string[] = [];
  const userPermittedRulesetReadIds: string[] = [];
  const userPermittedPublishedRulesetReadIds: string[] = [];

  const user: { id: string; email: string } = {
    id: '',
    email: '',
  };

  // Verify session token with Supabase private key
  const sessionToken = (token ?? '').replace('Bearer ', '');
  const payload = jwt.verify(sessionToken, dbSecret) as jwt.JwtPayload;

  if (!payload?.sub) {
    throw new GraphQLError('User is not authenticated', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 },
      },
    });
  }

  user.id = payload.sub ?? '';
  user.email = payload.email ?? '';

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

  // It should never be that a user exists in Supabase but not in the DB
  // Initial user bootstrap occurs in earlyAccessUser route
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
  };
};
