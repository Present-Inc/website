/**
 * PServices.UserContextApiClient
 * Creates, updates, and destroys User Context Tokens
 *   @dependency {Angular} $http
 *   @dependency {Angular} $q
 *   @dependency {Present} logger -- Configurable log for development
 *   @dependency {Present} ApiConfig  -- Provides API configuration properties
 */

  PServices.factory('UserContextApiClient', ['$http', '$q', 'logger', 'ApiConfig',

   function($http, $q, logger, ApiConfig) {
     return {
       /* Sends a request to the create method on the UserContexts resource
        * Handles successs and error blocks then resolves the api response to the Session Manager
        * @param <String> username
        * @param <String> password
        */

        createNewUserContext : function(username, password) {
          var sendingRequest = $q.defer();
          var resourceUrl = ApiConfig.getAddress() + '/v1/user_contexts/create';
          logger.debug(['PServices.UserContextApiClient.createNewUserContext -- prepping request', username, password])
          $http({
            method: 'POST',
            url: resourceUrl,
            data: {username: username, password: password}
          })
            .success(function(data, status, headers) {
              logger.debug(['PServices.UserContextApiClient.createNewUserContext -- http success block', status, data]);
              sendingRequest.resolve(data);
            })
            .error(function(data, status, headers) {
              logger.error(['PServices.UserContextApiClient.createNewUserContext -- http error block', status, data]);
              sendingRequest.reject();
            });

          return sendingRequest.promise;
        },

        destroyUserContext: function(session) {
          var sendingRequest = $q.defer();
          var resourceUrl = ApiConfig.getAddress() + '/v1/user_contexts/destroy';
          $http({
            method: 'POST',
            url: resourceUrl,
            headers: {
              'Present-User-Context-Session-Token' : session.token,
              'Present-User-Context-User-Id': session.userId
            }
          })
          .success(function(data, status, headers) {
            logger.debug(['PServices.UserContextApiClient.destroyUserContext -- http success block', status, headers]);
            sendingRequest.resolve();
          })
          .error(function(data, status, headers) {
            logger.error(['PServices.UserContextApiClient.destroyUserContext -- http error block', status, data]);
            sendingRequest.reject();
          })

          return sendingRequest.promise;
        }


     }
   }

  ]);
