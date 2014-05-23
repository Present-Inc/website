/**
 * karma.config.js
 * Karma configuration file
 */

module.exports = function(config) {
  config.set({

    /**
     * Set the base path the js directory
     */

    basePath: '../',

    frameworks: ['jasmine'],

    /**
     * Files to include in tests
     */

    files: [
      'lib/angular/angular.js',
      'lib/angular-ui-router/release/angular-ui-router.js',
      'lib/angular-local-storage/angular-local-storage.js',
      'lib/angular-mocks/angular-mocks.js',
      'dist/app.js',
      'test/**/*.js'
    ],


    exclude : ['public/js/main.js'],

    /**
     * Files to exlude in tests
     */
    exclude: ['test/karma.conf.js'],

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
