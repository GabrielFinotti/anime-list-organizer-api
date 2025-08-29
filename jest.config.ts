import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: {
          target: "esnext",
          module: "esnext",
          moduleResolution: "node",
          baseUrl: "./src",
          paths: {
            "@/*": ["*"],
            "@/application/*": ["application/*"],
            "@/domain/*": ["domain/*"],
            "@/infrastructure/*": ["infrastructure/*"],
          },
        },
      },
    ],
  },
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@/application/(.*)$": "<rootDir>/src/application/$1",
    "^@/domain/(.*)$": "<rootDir>/src/domain/$1",
    "^@/infrastructure/(.*)$": "<rootDir>/src/infrastructure/$1",
  },
  moduleFileExtensions: ["ts", "js"],
  verbose: true,
};

export default config;
