/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "^.+.tsx?$": [
      "ts-jest",
      {
        isolatedModules: true, // disable type checking
        useESM: true,
      },
    ],
  },
};
