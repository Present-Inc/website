/**
 * PManagers.UserContextManager
 *   @dependency {Angular} $q
 *   @dependency {Present} logger -- configurable logger for development
 *   @dependency {Present} UserContextApiClient -- handles present api requests for the user context resource
 */

PManagers.factory('UserContextManager', ['$q', 'localStorageService', 'logger', 'UserContextApiClient',
																				 'UserContextModel',

  function($q, localStorageService, logger, UserContextApiClient, UserContextModel) {

    return {

      /**
       * UserContextManager.createNewUserContext
       * Sends a request to create a new user context and stores it to local storage on success
       *   @param username <String> -- username in which the user context will be created with
       *   @param password <String> -- password to validate the user
			 *   @returns promise <Object>
       */

      createNewUserContext : function(username, password) {

        var creatingNewUserContext = $q.defer();

        UserContextApiClient.create(username, password)
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
       * UserContextManager.destroyActiveUserContext
       * Sends a request to delete the user context and clears userContext token from local storage
			 * @returns promise <Object>
       */

      destroyActiveUserContext : function() {

        var destroyingUserContext = $q.defer();

				if (localStorageService.get('token') && localStorageService.get('userId') && localStorageService.get('profile')) {

					var userContext = UserContextModel.create(
						localStorageService.get('token'),
						localStorageService.get('userId'),
						localStorageService.get('profile')
					);

          UserContextApiClient.destroy(userContext)
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
       * UserContextManager.getActiveUserContext
       * @returns userContext <Object> token if it exists
			 * @returns null <Null> if the userContext token is invalid
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
