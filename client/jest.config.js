module.exports = {
  verbose: true,
  setupFilesAfterEnv: ['./setupTests.ts'],
  projects: [
    {
      preset: 'ts-jest',
      testEnvironment: 'node',
      displayName: 'api',
      setupFilesAfterEnv: ['./packages/compass-api/setupTests.ts'],
      testMatch: ['<rootDir>/packages/compass-api/**/*.test.tsx'],
    },
  ],
};