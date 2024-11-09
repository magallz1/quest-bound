import { AuthorizerParams } from './types';
import * as jwt from 'jsonwebtoken';

export const restfulAuthorizer = async ({ token }: AuthorizerParams) => {
  const dbSecret = process.env.SUPABASE_SECRET_KEY ?? '';
  const mode = process.env.MODE ?? 'local';

  if (!token && mode === 'remote') {
    return false;
  }

  const sessionToken = (token ?? '').replace('Bearer ', '');

  try {
    const res = jwt.verify(sessionToken, dbSecret) as jwt.JwtPayload;
    return {
      email: res.email,
      id: res.sub ?? '',
    };
  } catch (e: any) {
    return false;
  }
};
