import { testConnection } from './test-connection';

export const testResolvers = {
  Query: {
    testConnection,
  },
};
