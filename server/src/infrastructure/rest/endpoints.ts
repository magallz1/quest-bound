import { Express } from 'express';
import { initializeEmailEndpoints } from './services/email';
import { initializeMetricsEndpoints } from './services/metrics';
import { initializeImportExportEndpoints } from './services/import-export';
import { initializeSigninEndpoints } from './services/signin';
import { initializeStorageEndpoints } from './services/storage';

export const initializeRestfulEndpoints = (app: Express) => {
  initializeEmailEndpoints(app);
  initializeMetricsEndpoints(app);
  initializeImportExportEndpoints(app);
  initializeSigninEndpoints(app);
  initializeStorageEndpoints(app);
};
