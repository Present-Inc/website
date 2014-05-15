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

     return PServices.factory('ProfileLoader', ['$q', 'logger', 'UsersApiClient', 'SessionManager',

       function($q, logger, UsersApiClient, SessionManager) {
         return {

           /**
            * loadProfile
            * Prepares the data from UserApiClient.show to be injected into the view controllers
            */

            loadProfile : function() {

              var session = SessionManager.getCurrentSession();

              var loadingProfile = $q.defer();
              UsersApiClient.show(session.userId)
                .then(function(rawApiResponse) {
                  var deserializedProfile = {};
                  logger.test(['PServices.ProfileLoader.loadProfile -- loading the profile data', rawApiResponse]);
                  loadingProfile.resolve(rawApiResponse);
                })
                .catch(function() {
                  logger.test
                    loadingProfile.resolve(false);
                });

                return loadingProfile.promise;

            }

         }
       }

     ]);



});
