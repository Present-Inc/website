/**
 * ProfileLoader.js
 * Defines a RequireJS module the Profile Loader Services
 */
define(['./module'], function(PServices) {

    /**
     * PServices.ProfileLoader
     * Provides and interface to the VideosApiClient to the view controllers
     * Parses and prepares the results provided from the UserApiClient
     *   @dependency {Angular} $q
     *   @dependency {Utilities} logger
     *   @dependency {Present} UsersApiClient
     *   @dependency {Present} Session Manager
     */

     return PServices.factory('ProfileLoader', ['$q', 'logger', 'UsersApiClient', 'ApiClientResponseHandler', 'SessionManager',

       function($q, logger, UsersApiClient, ApiClientResponseHandler, SessionManager) {

         return {

           /**
            * loadProfile
            * Prepares the data from UserApiClient.show to be injected into the view controllers
            */

            loadOwnProfile : function() {

              var loadingProfile = $q.defer();
              var session = SessionManager.getCurrentSession();

              if(session.token && session.userId) {
                  UsersApiClient.showMe(session)
                    .then(function(rawApiResponse) {
                      var deserializedProfile = {};
                      deserializedProfile = ApiClientResponseHandler.deserializeProfile(rawApiResponse.result.object);
                      logger.test(['PServices.ProfileLoader.loadOwnProfile -- loading the profile data', deserializedProfile]);
                      loadingProfile.resolve(deserializedProfile);
                    })
                    .catch(function() {
                      loadingProfile.resolve(false);
                    });
              }

              return loadingProfile.promise;

            },

            loadUserProfile : function(username) {

              var loadingProfile = $q.defer();
              var session = SessionManager.getCurrentSession();

              UsersApiClient.show(username, session)
                .then(function(rawApiResponse) {
                  var deserializedProfile = {};
                  deserializedProfile = ApiClientResponseHandler.deserializeProfile(rawApiResponse.result.object);
                  logger.debug(['PServices.ProfileLoader.loadOwnProfile -- loading the profile data', deserializedProfile]);
                  loadingProfile.resolve(deserializedProfile);
                })
                .catch(function() {
                  loadingProfile.resolve(false);
                });

              return loadingProfile.promise;
              
            }

         }
       }

     ]);



});
