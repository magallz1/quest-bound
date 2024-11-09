import { Express } from 'express';
import { buildRestfulRoutes } from '@helpers/build-restful-route';
import { metricsProxy } from './proxy';
import { appMetrics } from './app-metrics';

export const initializeMetricsEndpoints = (app: Express) => {
  buildRestfulRoutes([
    {
      app,
      path: 'metrics',
      method: 'post',
      authRequired: false,
      handler: metricsProxy,
    },
    {
      app,
      path: 'app-metrics',
      method: 'get',
      authRequired: false,
      handler: appMetrics,
    },
  ]);
};
