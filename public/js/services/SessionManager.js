/*
 * SessionManager.js
 * Defines RequireJS module for the SessionManager Service
 */

 define(['./module'], function(PServices) {

   /*
    * PServices.SessionManager
    *   @dependency {Angular} $q
    *   @dependency {Present} logger -- configurable logger for development
    *   @dependency {Present} UserContextApiClient -- interacts directly with the User Contexts Api Client
    *   @dependency {Present} ApiClientResponseHandler -- handles the raw api response
    */

    return PServices.factory('SessionManager', ['$q', 'localStorageService', 'logger', 'UserContextApiClient', 'ApiClientResponseHandler',

      function($q, localStorageService, logger, UserContextApiClient) {

        return {
          createNewSession : function(username, password) {
            var creatingSession = $q.defer();
            UserContextApiClient.createNewUserContext(username, password)
              .then(function(rawApiResponse) {
                logger.test(['PServices.SessionManager.login -- creating new session token'], rawApiResponse);
                localStorageService.set('sessionToken', rawApiResponse.result.object.sessionToken);
                localStorageService.set('userId', rawApiResponse.result.object.user.object._id);
                creatingSession.resolve();
              })
              .catch(function() {
                creatingSession.reject();
              });
            return creatingSession.promise
          },

          getCurrentSession : function() {
            var session = {
              token : localStorageService.get('sessionToken'),
              userId: localStorageService.get('userId')
            }

            return session;
          }

        }

      }

    ]);
 });
