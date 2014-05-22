/**
 * karma.config.js
 * Karma configuration file
 */

module.exports = function(config) {
  config.set({



    /**
     * Files to include in tests
     */


    basePath: '',

    frameworks: ['jasmine', 'requirejs'],

    files: [
      'public/js/test/test-main.js',
      {pattern: 'public/js/lib/**/*.js', included: false},
      {pattern: 'public/js/test/**/*Spec.js', included: false},
      {pattern: 'public/js/src/**/*.js', included: false},
    ],


    exclude : ['public/js/main.js'],

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
