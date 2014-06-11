/**
 * PConstructors.ApplicationConstructor
 * Provides properties and methods to manage the state of the application
 * Only injected one per application, usually on the highest level scope
 * 	@dependency logger {PUtilities}
 * 	@dependency $state {Ui-Router}
 * 	@dependency UserContextManager {PManager}
 */

  PConstructors.factory('ApplicationConstructor', ['logger', '$state', 'UserContextManager', 'ProfileConstructor',

		function(logger, $state, UserContextManager, ProfileConstructor) {
			return {
				create : function() {

					function Application() {

						this.user = {
							active : ''
						};

					}

					/**
					 * Application.authorize
					 * Checks to make sure the user has access to the requested state
					 * 	@param event -- stateChangeStart event object which contains the preventDefault method
					 * 	@param toState -- the state the the application is transitioning into
					 */

					Application.prototype.authorize = function(event, toState) {
						var userContext = UserContextManager.getActiveUserContext();
						if (toState.metaData.requireUserContext && !userContext) {
							event.preventDefault();
							$state.go('login');
						}
					};

					/**
					 * Application.login
					 * Handles user context creation, sets the activeUser property and changes the state to home
					 * 	@param username <String> -- the user provided username
					 * 	@param password <String> -- the user provided password
					 */

					Application.prototype.login = function(username, password) {

						var userContext = UserContextManager.getActiveUserContext();
						user = this.user;

						if (!userContext) {
							UserContextManager.createNewUserContext(username, password)
								.then(function (newUserContext) {
									user.active = ProfileConstructor.create(newUserContext.profile);
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
					 * Application.logout
					 * Handles user context deletion and changes the state to splash
					 */

					Application.prototype.logout = function() {
						UserContextManager.destroyActiveUserContext()
							.then(function() {
								$state.go('splash');
							});
					};

					return new Application();

				}
			};
  	}

	]);
