/**
 * karma.config.js
 * Karma configuration file
 */

module.exports = function(config) {
  config.set({



    /**
     * Files to include in tests
     */

    files = [
      JASMINE,
      JASMINE_ADAPTER,
      REQUIRE,
      REQUIRE_ADAPTER,

      {pattern: 'public/components/**/*.js', included: false},
      {pattern: 'public/js/**/*.js', included: false},
      {pattern: 'public/tests/**/Spec*.js', included: false},

      'tests/test-main.js'
    ];

    // list of files to exclude
    exclude = ['public/js/main.js'];

    /**
     * Files to exlude in tests
     */
    exclude: [],

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
