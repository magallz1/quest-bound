import { Express } from 'express';
import { getEmailList } from './get-list';
import { buildRestfulRoutes } from '@helpers/build-restful-route';
import { setEmailPreferences } from './preferences';
import { subscribeToEmailList } from './subscribe';
import { sendEmail } from './send';

export const initializeEmailEndpoints = (app: Express) => {
  buildRestfulRoutes([
    {
      app,
      path: 'emails/list',
      handler: getEmailList,
    },
    {
      app,
      path: 'emails/preferences',
      method: 'post',
      handler: setEmailPreferences,
    },
    {
      app,
      path: 'emails/subscribe',
      method: 'post',
      authRequired: false,
      handler: subscribeToEmailList,
    },
    {
      app,
      path: 'emails/send',
      method: 'post',
      handler: sendEmail,
    },
  ]);
};
