/*
 * UserContextApiClient.js
 * Defines a REquireJS module for the Present Video Api Client
 */


define(['../module'], function(PServices) {

  /*PServices.UserContextApiClient
   * Creates, updates, and destroys User Context Tokens
   *   @dependency {Angular} $http
   *   @dependency {Angular} $q
   *   @dependency {Present} Logger -- Configurable log for development
   *   @dependency {Present} ApiConfig  -- Provides API configuration properties
   */

   return PServices.factory('UserContextApiClient', ['$http', '$q', 'Logger', 'ApiConfig',

     function($http, $q, Logger, ApiConfig) {
       return {
         /* Sends a request to the create method on the UserContexts resource
          * Handles successs and error blocks then resolves the api response to the Session Manager
          * @param <String> username
          * @param <String> password
          */

          createNewUserContext : function(username, password) {
            var sendingRequest = $q.defer();
            var resourceUrl = ApiConfig.getAddress() + '/v1/user_contexts/create';
            Logger.test(['PServices.UserContextApiClient.createNewUserContext -- prepping request', username, password])
            $http({
              method: 'POST',
              url: resourceUrl,
              data: {username: username, password: password}
            })
              .success(function(data, status, headers) {
                Logger.test(['PServices.UserContextApiClient.createNewUserContext -- http success block', status, data]);
                sendingRequest.resolve(data);
              })
              .error(function(data, status, headers) {
                Logger.error(['PServices.UserContextApiClient.createNewUserContext -- http error block', status, data]);
              });

            return sendingRequest.promise;
          }
       }
     }

    ])

});
