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

    return PServices.factory('SessionManager', ['$q', 'Logger', 'UserContextApiClient', 'ApiClientResponseHandler'

    function($q, Logger, UserContextApiClient) {

      function SessionManager(Logger, UserContextApiClient) {
        this.isLoggedIn = false,
        this.username = '',
        this.sessionToken = ''sd
      };

      SessionManager.prototype.createNewSession = function(username, password) {
        var CreatingSession = $q.defer();
        UserContextApiClient.createNewUserContext(username, password)
          .then(function(rawApiResponse) {
            Logger.test(['PServices.SessionManager.login -- creating new session token'], rawApiResponse);

            defer.resolve();
          });

        return CreatingSession.promise
      };

      return new SessionManager;

    }

    ]);
 });
