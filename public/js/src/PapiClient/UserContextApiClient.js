/**
 * PApiClient.UserContextApiClient
 * Creates, updates, and destroys User Context Tokens
 *   @dependency $http {Angular}
 *   @dependency $q {Angular}
 *   @dependency logger {PUtilities} -- Configurable log for development
 *   @dependency ApiConfig {PApiClient} -- Provides API configuration properties
 */

  PApiClient.factory('UserContextApiClient', ['$http', '$q', 'logger', 'ApiConfig',

   function($http, $q, logger, ApiConfig) {
     return {

        create : function(username, password) {
          var sendingRequest = $q.defer();
          var resourceUrl = ApiConfig.getAddress() + '/v1/user_contexts/create';
          $http({
            method: 'POST',
            url: resourceUrl,
            data: {username: username, password: password}
          })
            .success(function(data, status, headers) {
              logger.debug(['PServices.UserContextApiClient.createNewUserContext', 'http success block', status, data]);
              sendingRequest.resolve(data);
            })
            .error(function(data, status, headers) {
              logger.error(['PServices.UserContextApiClient.createNewUserContext', 'http error block', status, data]);
              sendingRequest.reject(data);
            });
          return sendingRequest.promise;
        },

        destroy: function(userContext) {
          var sendingRequest = $q.defer();
          var resourceUrl = ApiConfig.getAddress() + '/v1/user_contexts/destroy';
          if(userContext) {
              $http({
                method: 'POST',
                url: resourceUrl,
								headers: {
									'Present-User-Context-Session-Token' : userContext.token,
									'Present-User-Context-User-Id': userContext.userId
								}
              })
              .success(function(data, status, headers) {
                logger.debug(['PServices.UserContextApiClient.destroyUserContext -- http success block', status, data]);
                sendingRequest.resolve(data);
              })
              .error(function(data, status, headers) {
                logger.error(['PServices.UserContextApiClient.destroyUserContext -- http error block', status, data]);
                sendingRequest.reject(data);
              })
          } else {
            logger.error(['PApiClient.UserContextApiClient.destroyUserContext', 'request not sent: invalid userContext']);
						sendingRequest.reject({status: 'ERROR', mock:true});
          }
          return sendingRequest.promise;
        }

     }
   }

  ]);
