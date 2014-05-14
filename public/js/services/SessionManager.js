/*
 * SessionManager.js
 * Defines RequireJS module for the SessionManager Service
 */

 define(['./module'], function(PServices) {

   /*
    * PServices.SessionManager
    *   @dependency {Angular} $q
    *   @dependency {Present} Logger
    *   @dependency {Present} UserContextApiClient -- interacts directly with the User Contexts Api Client
    *   @dependency {Present} ApiClientResponseHandler -- handles the raw api response
    */

    return PServices.factory('SessionManager', ['$q', 'Logger', 'UserContextApiClient', 'ApiClientResponseHandler',

    function($q, Logger, UserContextApiClient) {

      function SessionManager($q, Logger, UserContextApiClient, ApiClientResponseHandler) {
        this.isLoggedIn = false,
        this.userId = '',
        this.sessionToken = ''
      };

      SessionManager.prototype.createNewSession = function(username, password) {
        var creatingSession = $q.defer();
        UserContextApiClient.createNewUserContext(username, password)
          .then(function(rawApiResponse) {
            Logger.test(['PServices.SessionManager.login -- creating new session token'], rawApiResponse);
            var deserializedUserSession = {
              sessionToken : rawApiResponse.result.object.sessionToken,
              sessionUserId : rawApiResponse.result.object.user.object._id
            };
            creatingSession.resolve(deserializedUserSession);
          })
          .catch(function() {
            creatingSession.reject();
          });

        return creatingSession.promise
      };

      return new SessionManager;

    }

    ]);
 });
