module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "\\.(gql|graphql)$": "jest-transform-graphql",
    ".*": "ts-jest"
  },
  reporters: ["default", "jest-junit"]
};
