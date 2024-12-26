import { AuthorizerParams } from './types';
import { verifyToken } from './utils';
import { dbClient } from '@/database';

// For personal use and self hosting, this can be set to false.
// Otherwise, set to true and implement your auth logic.
const AUTHORIZATION_REQUIRED = false;

export const restfulAuthorizer = async ({ token }: AuthorizerParams) => {
  const mode = process.env.MODE ?? 'local';
  const db = dbClient();

  if (!token && mode === 'remote') {
    return false;
  }

  const sessionToken = (token ?? '').replace('Bearer ', '');

  try {
    if (AUTHORIZATION_REQUIRED) {
      const user = verifyToken(sessionToken);

      return {
        email: user.email,
        id: user.id ?? '',
      };
    } else {
      const user = await db.user.findUnique({
        where: { id: sessionToken },
      });

      if (!user) {
        return false;
      }
      return {
        email: user.email,
        id: user.id,
      };
    }
  } catch (e: any) {
    return false;
  }
};
