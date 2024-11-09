import { Express } from 'express';
import { buildRestfulRoutes } from '@helpers/build-restful-route';
import { importAttributes } from './import';

export const initializeImportExportEndpoints = (app: Express) => {
  buildRestfulRoutes([
    {
      app,
      path: 'import/attributes',
      method: 'post',
      authRequired: true,
      handler: importAttributes,
    },
  ]);
};
