
  /**
   * PUtilities.logger
   * Configurable logger for development
   */

  var debugModeEnabled = true;
  var testModeEnabled  = true;

  PServices.factory('logger', [function() {
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
