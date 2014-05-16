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
                logger.debug(['PServices.SessionManager.login -- creating new session token'], rawApiResponse);
                localStorageService.set('sessionToken', rawApiResponse.result.object.sessionToken);
                localStorageService.set('userId', rawApiResponse.result.object.user.object._id);
                creatingSession.resolve();
              })
              .catch(function() {
                creatingSession.reject();
              });
            return creatingSession.promise
          },

          destroyCurrentSession : function() {
            var deletingSession = $q.defer();
            var session = {
              token : localStorageService.get('sessionToken'),
              userId: localStorageService.get('userId')
            };
            logger.debug(['PServices.SessionManager.destroyCurrentSession -- destroying user session']);
            UserContextApiClient.destroyUserContext(session)
               .then(function() {
                 localStorageService.clearAll();
                 deletingSession.resolve();
               })
               .catch(function() {
                 localStorageService.clearAll();
                 logger.error(['PServices.SessionManager.destroyCurrentSession -- user context deletion failed, session data being deleted regardless']);
                 deletingSession.resolve();
               });

            return deletingSession.promise;
          },

          getCurrentSession : function() {
            var session = {
              token : localStorageService.get('sessionToken'),
              userId: localStorageService.get('userId')
            };
            return session;
          },

          checkForValidSession : function() {
            var session = {
              token: localStorageService.get('sessionToken'),
              userId: localStorageService.get('userId')
            };

            if(session.token && session.userId) return true
            else return false;

            logger.test(['PServices.SessionManager -- checking for valid session', session]);

            return true;
          }

        }

      }

    ]);

 });
