/*
 * Logger.js
 * Defines a RequireJS Module for the Utilities Service
 */


define(['./module'], function(PServices) {

  /* PServices.DevLogger
   * Configurable Logger for development
   */

   var debugModeEnabled = true;
   var testModeEnabled  = true;

   return PServices.factory('Logger', [function() {
    return {
      debug: function(content) {
        if(debugModeEnabled) {
          console.log(content);
        }
      },
      test: function(content) {
        console.log(content);
      },
      error: function(content) {
        console.warn(content);
      }
    }
   }]);

});
