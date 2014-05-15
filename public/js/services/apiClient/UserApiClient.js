/**
 * UsersApiClient
 * Defines a RequireJS modile for the Present User Api Client
 */

define(['./module'], function(PServices) {

  /**
   * PServices.UsersApiClient
   * Sends API requests directed at the Users API resource and handles the raw API response.
   *   @dependency {Angular} $http
   *   @dependency {Angular} $q
   *   @dependency {Present} logger -- Configurable log For development
   *   @dependency {Present} ApiConfig -- Provides API configuration properties
   *
   */

   return PServices.factory('UsersApiClient', ['$http', '$q', 'logger', 'ApiConfig',

    function($http, $q, logger, ApiConfig) {

      /**
       * Sends a request to the show users resource
       * Handles success and error blocks and then resolves the API response to somewhere...
       *   @param <String> username -- the user whose profile is being requested
       */


       show: function(username) {
         var sendingRequest = $q.defer();
         var resourceUrl = ApiConfig.getAddress() + '/v1/users/show';
         $http({
           method: 'GET',
           url: resourceUrl,
           params: {username: username}
         })
           .success(function(data, status, headers) {
             logger.debug(['PServices.UsersApiClient.show -- http success block', status, data]);
             sendingRequest.resolve(data);
           })
           .error(function (data, status, headers) {
             logger.error(['PServices.UsersApiClient.show -- http error block', status, data]);
             sendingRequest.erject(data);
           })
       }

    })

})
