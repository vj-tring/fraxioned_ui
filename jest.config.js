module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/index.ts",
    "!src/serviceWorker.ts",
    "!src/setupTests.ts"
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["html", "text", "lcov", "json"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
  },
  transformIgnorePatterns: ["node_modules/(?!(axios|react|react-dom)/)"]
};
