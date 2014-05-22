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
    */

    return PServices.factory('SessionManager', ['$q', 'localStorageService', 'logger', 'UserContextApiClient',

      function($q, localStorageService, logger, UserContextApiClient) {

        return {

          /**
           * createNewSession
           * Sends a request to create a new user context and stores it to local storage on success
           *   @param <String> username -- username in which the user context will be created with
           *   @param <String> password -- password to validate the user
           */

          createNewSession : function(username, password) {

            var creatingSession = $q.defer();

            UserContextApiClient.createNewUserContext(username, password)
              .then(function(rawApiResponse) {
                logger.debug(['PServices.SessionManager.creatingNew Session -- creating new session token'], rawApiResponse);
                localStorageService.set('sessionToken', rawApiResponse.result.object.sessionToken);
                localStorageService.set('userId', rawApiResponse.result.object.user.object._id);
                creatingSession.resolve();
              })
              .catch(function() {
                logger.error(['PServices.SessionManager.creatingNewSession -- couldn\'t create session token'])
                creatingSession.reject();
              });

            return creatingSession.promise

          },

          /**
           * destroyCurrentSession
           * Sends a request to delete the user context and clears session token from local storage
           */

          destroyCurrentSession : function() {

            var deletingSession = $q.defer();

            var session = {
              token : localStorageService.get('sessionToken'),
              userId: localStorageService.get('userId')
            };

            if(session.token && session.userId) {

              UserContextApiClient.destroyUserContext(session)
                .then(function() {
                  logger.debug(['PServices.SessionManager.destroyCurrentSession', 'User context deleted. Destroying current session']);
                  localStorageService.clearAll();
                  deletingSession.resolve();
                })
                .catch(function() {
                  logger.error(['PServices.SessionManager.destroyCurrentSession', 'User context deletion failed, session data being deleted regardless']);
                  localStorageService.clearAll();
                  deletingSession.reject();
                });
            } else {
              logger.error(['PServices.SessionManager.destroyCurrentSession -- no session set. ']);
              deletingSession.reject();
            }

            return deletingSession.promise;

          },

          /**
           * getCurrentSession
           * Returns the session token if it exists. Returns false if the session token is invalid
           */

          getCurrentSession : function() {

            var session = {
              token : localStorageService.get('sessionToken'),
              userId: localStorageService.get('userId')
            };

            if(session.token && session.userId) return session;
            else return false;

          }

        }

      }

    ]);

 });
