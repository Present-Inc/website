/**
 * PManagers.ApplicationManager
 * Provides properties and methods to manage the state of the application
 * Only injected one per application, usually on the highest level scope
 * 	@dependency logger {PUtilities}
 * 	@dependency $state {Ui-Router}
 * 	@dependency UserContextManager {PManager}
 */

  PManagers.factory('ApplicationManager', ['logger', '$state', 'UserContextManager',

		function(logger, $state, UserContextManager) {

    function ApplicationManager() {

			this.user = {
				active : ''
			};

    }

		/**
		 * ApplicationManager.authorize
		 * Checks to make sure the user has access to the requested state
		 * 	@param event -- stateChangeStart event object which contains the preventDefault method
		 * 	@param toState -- the state the the application is transitioning into
		 */

		ApplicationManager.prototype.authorize = function(event, toState) {
			var userContext = UserContextManager.getActiveUserContext();
			if (toState.metaData.requireSession && !userContext) {
					event.preventDefault();
					$state.go('login');
			}
		};

		/**
		 * ApplicationManager.login
		 * Handles user context creation, sets the activeUser property and changes the state to home
		 * 	@param username <String> -- the user provided username
		 * 	@param password <String> -- the user provided password
		 */

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
						//TODO: better error handling
						alert('username and/or password is incorrect');
					});

			} else {
				$state.go('home');
			}

		};

		/**
		 * ApplicationManager.logout
		 * Handles user context deletion and changes the state to splash
		 */

		ApplicationManager.prototype.logout = function() {
			UserContextManager.destroyActiveUserContext()
				.then(function() {
					$state.go('splash');
				});
		};

    return new ApplicationManager();

  	}

	]);
