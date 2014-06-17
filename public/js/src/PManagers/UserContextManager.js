/**
 * Manages the user context for the active user session
 * @namespace
 * @param {Angular} $q
 * @param {LStorage} localStorageService
 * @param {PUtilties} logger
 * @param {PManager} ApiManager
 * @param {PModel} UserContextModel
 */

PManagers.factory('UserContextManager', ['$q', 'localStorageService', 'logger', 'ApiManager',
																				 'UserContextModel',

  function($q, localStorageService, logger, ApiManager, UserContextModel) {

		/**
		 * @static service for managing user context
		 */

    return {

      /**
       * Sends a request to create a new user context and stores it to local storage on success
       * @param {String} username - username in which the user context will be created with
       * @param {String} password - password to validate the user
			 * @returns {*}
       */

      createNewUserContext : function(username, password) {

        var creatingNewUserContext = $q.defer();

        ApiManager.userContexts('create', null, {username : username, password: password})
          .then(function(apiResponse) {
          	var userContext = UserContextModel.construct(apiResponse.result.object);
            localStorageService.clearAll();
            localStorageService.set('token', userContext.token);
            localStorageService.set('userId', userContext.userId);
						localStorageService.set('profile', JSON.stringify(userContext.profile));
						logger.debug(['PServices.UserContextManager.createNewUserContext', 'creating new user context', userContext]);
            creatingNewUserContext.resolve(userContext);
          })
          .catch(function(error) {
            logger.error(['PServices.UserContextManager.createNewUserContext', 'couldn\'t create user context']);
            creatingNewUserContext.reject(error);
          });

        return creatingNewUserContext.promise

      },

      /**
       * Sends a request to delete the user context and clears userContext token from local storage
			 * @returns {*}
       */

      destroyActiveUserContext : function() {

        var destroyingUserContext = $q.defer();

				if (localStorageService.get('token') && localStorageService.get('userId') && localStorageService.get('profile')) {

					var userContext = UserContextModel.create(
						localStorageService.get('token'),
						localStorageService.get('userId'),
						localStorageService.get('profile')
					);

					ApiManager.userContexts('destroy', userContext, {})
            .then(function(apiResponse) {
              logger.debug(['PServices.UserContextManager.destroyActiveUserContext',
                            'User context deleted. User context data being deleted from local storage']);
              localStorageService.clearAll();
              destroyingUserContext.resolve();
            })
            .catch(function(error) {
              logger.error(['PServices.UserContextManager.destroyActiveUserContext',
                            'User context deletion failed. User context data being deleted from local storage']);
              localStorageService.clearAll();
              destroyingUserContext.resolve();
            });

        } else {
          logger.error(['PServices.UserContextManager.destroyActiveUserContext', 'no user context defined']);
          destroyingUserContext.reject('The user context is not defined');
        }

        return destroyingUserContext.promise;

      },

      /**
       * Retrieves the active user context from session storage
       * @return {UserContext} [userContext]
       */

      getActiveUserContext : function() {

        if (localStorageService.get('token') && localStorageService.get('userId') && localStorageService.get('profile')) {
					return userContext = UserContextModel.create(
						localStorageService.get('token'),
						localStorageService.get('userId'),
						localStorageService.get('profile')
					);
				} else return null;

      }

    }

  }

]);
