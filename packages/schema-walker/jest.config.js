const { defaults } = require("jest-config");

module.exports = {
  preset: "ts-jest",
  roots: ["<rootDir>/lib"],
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$",
  moduleFileExtensions: ["ts", "tsx", ...defaults.moduleFileExtensions]
};

// module.exports = {
//   preset: "ts-jest",
//   testEnvironment: "node",
//   roots: ["<rootDir>/lib"],
//   transform: {
//     "^.+\\.tsx?$": "ts-jest"
//   },
//   // testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],
//   testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
//   moduleFileExtensions: ["ts", "tsx", ...defaults.moduleFileExtensions]
// };

// // (/__tests__/.*|(\.|/)(test|spec))\.tsx?$
