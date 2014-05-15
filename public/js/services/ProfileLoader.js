/**
 * ProfileLoader.js
 * Defines a RequireJS module the Profile Loader Services
 */
define(['./module', function(PServices) {

    /**
     * PServices.ProfileLoader
     * Provides and interface to the VideosApiClient to the view controllers
     * Parses and prepares the results provided from the UserApiClient
     */

     return Pservices.factory('ProfileLoader', ['$q', 'logger', 'VidoesApiClient', 'ApiClientResponseHandler', 'SerssionManager',

       function($q, logger, VidoesApiClient, ApiClientResponseHandler, SerssionManager) {
         return {

           /**
            * loadProfile
            * Prepares the data from UserApiClient.show to be injected into the view controllers
            */

            loadProfile : function() {
              var loadingProfile = $q.defer();
              UsersApiClient.show()
                .then(function(rawApiResponse) {
                  var deserializedProfile = {},
                  logger.test(['PServices.ProfileLoader.loadProfile -- loading the profile data', rawApiResponse]);
                  loadingProfile.resolve(rawApiResponse);
                })
                .catch(function() {
                    loadingProfileFeed.resolve(false);
                });

                return loadingProfile.promise 

            }

         }
       }

     ])



}]);
