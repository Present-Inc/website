/**
 * Invoke
 */

	PUtilities.factory('invoke', ['UserContextManager', function(UserContextManager) {
		return function (model, method, params, requiresUserContext) {

			var userContext = UserContextManager.getActiveUserContext();

			if (requiresUserContext && !userContext) {
				$state.go('login');
			} else {
				model[method](params);
			}

		}
	}]);
/**
 * PUtilities.logger
 * Configurable logger for development
 */

  var debugModeEnabled = true;
  var testModeEnabled  = true;

  PUtilities.factory('logger', [function() {
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
