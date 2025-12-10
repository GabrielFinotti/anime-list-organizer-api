/** @type {import('jest').Config} */
const baseConfig = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.jest.json',
        useESM: true,
        diagnostics: { ignoreCodes: [151002] },
      },
    ],
  },
  moduleNameMapper: {
    '^(\.{1,2}/.*)\\.js$': '$1',
  },
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/**/*.spec.ts', '!src/**/*.test.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
};

const unitConfig = {
  ...baseConfig,
  displayName: 'unit',
  roots: ['<rootDir>/tests/unit'],
  testMatch: ['**/?(*.)+(spec|test).ts'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};

const integrationConfig = {
  ...baseConfig,
  displayName: 'integration',
  roots: ['<rootDir>/tests/integration'],
  testMatch: ['**/?(*.)+(spec|test).ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/integration/setup/jest.setup.ts'],
  testTimeout: 30000,
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};

const config = {
  projects: [unitConfig, integrationConfig],
  collectCoverageFrom: baseConfig.collectCoverageFrom,
  coveragePathIgnorePatterns: baseConfig.coveragePathIgnorePatterns,
};

module.exports = config;
