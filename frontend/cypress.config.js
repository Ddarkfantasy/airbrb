const { defineConfig } = require("cypress");

module.exports = defineConfig({
  videoCompression: 50,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
