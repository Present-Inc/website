
/**
 * PServices.UserContextManager
 *   @dependency {Angular} $q
 *   @dependency {Present} logger -- configurable logger for development
 *   @dependency {Present} UserContextApiClient -- handles present api requests for the user context resource
 */

PServices.factory('UserContextManager', ['$q', 'localStorageService', 'logger', 'UserContextApiClient',

  function($q, localStorageService, logger, UserContextApiClient) {

    return {

      /**
       * createNewUserContext
       * Sends a request to create a new user context and stores it to local storage on success
       *   @param <String> username -- username in which the user context will be created with
       *   @param <String> password -- password to validate the user
       */

      createNewUserContext : function(username, password) {

        var creatingNewUserContext = $q.defer();

        UserContextApiClient.create(username, password)
          .then(function(rawApiResponse) {
            logger.debug(['PServices.UserContextManager.createNewUserContext', 'creating new user context'], rawApiResponse);
            var userContext = {
              sessionToken: rawApiResponse.result.object.sessionToken,
              userId: rawApiResponse.result.object.user.object._id
            };
            localStorageService.set('sessionToken', userContext.sessionToken);
            localStorageService.set('userId', userContext.userId);
            creatingNewUserContext.resolve(userContext);
          })
          .catch(function(error) {
            logger.error(['PServices.UserContextManager.createNewUserContext', 'couldn\'t create user context']);
            creatingNewUserContext.reject(error);
          });

        return creatingNewUserContext.promise

      },

      /**
       * destroyActiveUserContext
       * Sends a request to delete the user context and clears session token from local storage
       */

      destroyActiveUserContext : function() {

        var destroyingUserContext = $q.defer();

        var userContext = {
          sessionToken : localStorageService.get('sessionToken'),
          userId: localStorageService.get('userId')
        };

        if(userContext.sessionToken && userContext.userId) {

          UserContextApiClient.destroy(userContext)
            .then(function() {
              logger.debug(['PServices.UserContextManager.destroyActiveUserContext',
                            'User context deleted. User context data being deleted from local storage']);
              localStorageService.clearAll();
              destroyingUserContext.resolve();
            })
            .catch(function(error) {
              logger.error(['PServices.UserContextManager.destroyActiveUserContext',
                            'User context deletion failed. User context data being deleted from local storage']);
              localStorageService.clearAll();
              destroyingUserContext.reject(error);
            });

        } else {
          logger.error(['PServices.UserContextManager.destroyActiveUserContext', 'no user context defined']);
          destroyingUserContext.reject('The user context is not defined');
        }

        return destroyingUserContext.promise;

      },

      /**
       * getActiveUserContext
       * Returns the session token if it exists. Returns false if the session token is invalid
       */

      getActiveUserContext : function() {

        var userContext = {
          sessionToken : localStorageService.get('sessionToken'),
          userId: localStorageService.get('userId')
        };

        if(userContext.sessionToken && userContext.userId) return userContext;
        else return undefined;

      }

    }

  }

]);
