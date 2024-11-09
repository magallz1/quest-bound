import { dbClient, supabaseClient } from '@/database';
import { EarlyAccessUserInput } from '@/infrastructure/graphql/generated-types';
import { AuthorizationContext, ResolverInput } from '@/infrastructure/types';
import { v4 as uuid } from 'uuid';

/**
 * Returns if the user with the provided email has an account
 */
export const earlyAccessUser = async (
  parent: any,
  args: ResolverInput<EarlyAccessUserInput>,
  context: AuthorizationContext,
) => {
  const db = dbClient();
  const { input } = args;

  if (!input.email) {
    throw Error('Email is required');
  }

  const existingUser = await db.user.findFirst({
    where: {
      email: {
        equals: input.email,
        mode: 'insensitive',
      },
    },
  });

  return !!existingUser;
};
