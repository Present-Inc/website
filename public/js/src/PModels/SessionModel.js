/**
 * Provides properties and methods to manage the state of the UserSession
 * @param {PUtilities} logger
 * @param {UIRouter} $state
 * @param {PManagaers} UserContextManager
 */

  PModels.factory('SessionModel', ['$rootScope', '$state', 'logger', 'UserContextManager',

		function($rootScope, $state, logger, UserContextManager) {
			return {

				/**
				 * Ensure the user has access to the requested state
				 * @param {Event} event -- stateChangeStart event object which contains the preventDefault method
				 * @param {Object }toState -- the state the the UserSession is transitioning into
				 */

				authorize : function(event, toState) {

					var userContext = UserContextManager.getActiveUserContext();
					if (toState.meta.availability == 'private' && !userContext) {
						event.preventDefault();
						$state.go('account.login');
					}

				},


				/**
				 * Handles user context creation, sets the activeUser property and changes the state to home.default
				 * @param {Object} options
				 */

				login: function(options) {

					var userContext = UserContextManager.getActiveUserContext();

					if (!userContext) {
						UserContextManager.createNewUserContext(options.input.username, options.input.password)
							.then(function () {
								$rootScope.$broadcast('_newUserLoggedIn');
								$state.go('home.default');
							})
							.catch(function () {
								//TODO: Implement better user feedback for failed login
								alert('username and/or password is incorrect');
							});

					} else {
						$state.go('home.default');
					}

				},

				/**
				 * Handles user context deletion and changes the state to splash
				 */

				logout: function() {
					UserContextManager.destroyActiveUserContext()
						.then(function () {
							$state.go('splash');
						});
				}

			};

  	}

	]);
