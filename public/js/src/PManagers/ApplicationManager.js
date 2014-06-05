/*
* PManagers.ApplicationManager
* Provides properties and methods to manage the state of the application
* Only injected one per application, usually on the highest level scope
*/

  PManagers.factory('ApplicationManager', ['logger', '$state', '$rootScope', 'UserContextManager',

		function(logger, $state, $rootScope, UserContextManager) {

    function ApplicationManager() {

			this.user = {
				active : ''
			};

      this.mode = {
				loggedIn   : false,
				fullscreen : true
			};

    }

		ApplicationManager.prototype.configure = function(toState) {

			var userContext = UserContextManager.getActiveUserContext();

			if (userContext) this.mode.loggedIn = true;
			else this.mode.loggedIn = false;

			if (toState) this.mode.fullscreen = true;
			else this.mode.fullscreen = false;

		};

		ApplicationManager.prototype.authorize = function(event, toState) {
			var userContext = UserContextManager.getActiveUserContext();
			if(toState.metaData.requireSession && !userContext) {
					event.preventDefault();
					$state.go('login');
			}
		};

		ApplicationManager.prototype.login = function(username, password) {
			var user = this.user;
			UserContextManager.createNewUserContext(username, password)
				.then(function(newUserContext) {
					user.active = newUserContext.profile;
					$state.go('home');
				})
				.catch(function() {
					alert('username and/or password is incorrect');
				});
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
