import { dbClient } from '@/database';
import { UserRole } from '@/infrastructure/graphql';
import { RestfulResponse } from '../../types';

type LoginOrSignupArgs = {
  email: string;
};

/**
 * For use when user auth is NOT required. If auth is required, verify the token in the GraphQL authorizer instead.
 */
export const loginOrSignup = async (data: LoginOrSignupArgs): Promise<RestfulResponse> => {
  try {
    const { email } = data;
    const db = dbClient();

    let currentUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (currentUser) {
      return {
        body: JSON.stringify({ id: currentUser.id }),
        statusCode: 200,
      };
    }

    currentUser = await db.user.create({
      data: {
        email,
        role: UserRole.CREATOR,
        username: email.split('@')[0],
        preferences: {
          emailUnsubscribe: false,
          emailUpdates: false,
          emailShares: true,
        },
      },
    });

    return {
      body: JSON.stringify({ id: currentUser.id }),
      statusCode: 200,
    };
  } catch (e) {
    return {
      body: JSON.stringify(e),
      statusCode: 500,
    };
  }
};
