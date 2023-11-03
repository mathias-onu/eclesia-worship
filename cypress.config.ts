import { defineConfig } from "cypress";

export default defineConfig({
  env: {
    apiUrl: 'http://localhost:8080/api',
  },
  e2e: {
    retries: {
      runMode: 1
    },
    baseUrl: 'http://localhost:4200',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
