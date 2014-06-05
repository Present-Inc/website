/**
 * PManagers.ApplicationManager
 * Provides properties and methods to manage the state of the application
 * Only injected one per application, usually on the highest level scope
 */

  PManagers.factory('ApplicationManager', ['logger', '$state', 'UserContextManager',

		function(logger, $state, UserContextManager) {

    function ApplicationManager() {

			this.user = {
				active : ''
			};

    }

		ApplicationManager.prototype.authorize = function(event, toState) {
			var userContext = UserContextManager.getActiveUserContext();
			if (toState.metaData.requireSession && !userContext) {
					event.preventDefault();
					$state.go('login');
			}
		};

		ApplicationManager.prototype.login = function(username, password) {

			var userContext = UserContextManager.getActiveUserContext();
					user = this.user;

			if (!userContext) {
				UserContextManager.createNewUserContext(username, password)
					.then(function (newUserContext) {
						user.active = newUserContext.profile;
						$state.go('home');
					})
					.catch(function () {
						alert('username and/or password is incorrect');
					});

			} else {
				$state.go('home');
			}


		};

		ApplicationManager.prototype.logout = function() {
			UserContextManager.destroyActiveUserContext()
				.then(function() {
					$state.go('splash');
				});
		};

    return new ApplicationManager();

  	}

	]);
