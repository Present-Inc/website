/**
 * Provides properties and methods to manage the state of the UserSession
 * @param {PUtilities} logger
 * @param {UIRouter} $state
 * @param {PManagaers} UserContextManager
 */

  PModels.factory('UserSessionModel', ['logger', '$state', 'UserContextManager',

		function(logger, $state, UserContextManager) {
			return {
				create : function() {

					function UserSession() {

						this.user = {
							active : ''
						};

					}

					/**
					 * Checks to make sure the user has access to the requested state
					 * @param {Event} event -- stateChangeStart event object which contains the preventDefault method
					 * @param {Object }toState -- the state the the UserSession is transitioning into
					 */

					UserSession.prototype.authorize = function(event, toState) {
						var userContext = UserContextManager.getActiveUserContext();
						if (toState.metaData.requireUserContext && !userContext) {
							event.preventDefault();
							$state.go('login');
						}
					};

					/**
					 * Handles user context creation, sets the activeUser property and changes the state to home
					 * @param {String} username - The user provided username
					 * @param {String} password - The user provided password
					 */

					UserSession.prototype.login = function(username, password) {

						var userContext = UserContextManager.getActiveUserContext(),
								_this = this;

						if (!userContext) {
							UserContextManager.createNewUserContext(username, password)
								.then(function (newUserContext) {
									_this.user.active = newUserContext.profile;
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
					 * Handles user context deletion and changes the state to splash
					 */

					UserSession.prototype.logout = function() {
						UserContextManager.destroyActiveUserContext()
							.then(function() {
								$state.go('splash');
							});
					};

					return new UserSession();

				}
			};
  	}

	]);
