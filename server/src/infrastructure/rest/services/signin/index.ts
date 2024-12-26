import { buildRestfulRoutes } from '@/infrastructure/server-helpers/build-restful-route';
import { loginOrSignup } from './login-or-signup';
import { Express } from 'express';

export const initializeSigninEndpoints = (app: Express) => {
  buildRestfulRoutes([
    {
      app,
      path: 'signup',
      method: 'post',
      authRequired: false,
      handler: loginOrSignup,
    },
  ]);
};
