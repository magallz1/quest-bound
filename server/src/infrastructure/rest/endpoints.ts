import { Express } from 'express';
import { initializeEmailEndpoints } from './services/email';
import { initializeMetricsEndpoints } from './services/metrics';
import { initializePaymentEndpoints } from './services/payment';
import { initializeLocalUtilRoutes } from './services/local-utils';
import { initializeImportExportEndpoints } from './services/import-export';

const mode = process.env.MODE || 'local';

export const initializeRestfulEndpoints = (app: Express) => {
  initializeEmailEndpoints(app);
  initializeMetricsEndpoints(app);
  initializePaymentEndpoints(app);
  initializeImportExportEndpoints(app);
  if (mode === 'local') {
    initializeLocalUtilRoutes(app);
  }
};
