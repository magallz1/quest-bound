import { GraphQLError } from 'graphql';
import * as jwt from 'jsonwebtoken';

const dbSecret = process.env.SUPABASE_SECRET_KEY ?? '';

/**
 * Verify the session token and return the user ID and email.
 *
 * This example assumes using Supabase for authentication. Swap the token verification to suit your auth provider.
 */
export function verifyToken(token: string): { id: string; email: string } {
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

  return user;
}
