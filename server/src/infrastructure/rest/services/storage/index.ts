import { buildRestfulRoutes } from '@/infrastructure/server-helpers/build-restful-route';
import { Express } from 'express';
import { uploadFile } from './file-upload';

export const initializeStorageEndpoints = (app: Express) => {
  buildRestfulRoutes([
    {
      app,
      path: 'storage/upload',
      method: 'upload',
      handler: uploadFile,
      authRequired: false,
    },
  ]);
};
