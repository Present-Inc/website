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