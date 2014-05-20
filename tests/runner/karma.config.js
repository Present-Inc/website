/**
 * karma.config.js
 * Karma configuration file
 */

module.exports = function(config) {
  config.set({

    /**
     * Base Path
     * Root of the working directory
     */
    basePath: '../../',

    /**
     * Framework -- Jasmine
     */
    frameworks: ['jasmine'],

    /**
     * Files to include in tests
     */
    files: [
      'tests/SessionManager.test.js'
    ],

    /**
     * Files to exlude in tests
     */
    exclude: [

    ],

    /**
     * Reporter -- Progress
     */
    reporters: ['progress'],

    /**
     * Web Server Port
     */
    port: 9876,

    /**
     * Enable and disable colors in the output
     */
    colors: true,

    /**
     * Enable or disable file watching
     */
    autoWatch: false,

    /**
     * Set browser list for tests to run on
     */
    browsers: ['PhantomJS'],

    /**
     * Continuous Integration Mode
     */
    singleRun: true

  });
};
