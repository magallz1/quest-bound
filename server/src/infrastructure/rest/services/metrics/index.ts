import { Express } from 'express';
import { buildRestfulRoutes } from '@helpers/build-restful-route';
import { metricsProxy } from './proxy';

export const initializeMetricsEndpoints = (app: Express) => {
  buildRestfulRoutes([
    {
      app,
      path: 'metrics',
      method: 'post',
      authRequired: false,
      handler: metricsProxy,
    },
  ]);
};
