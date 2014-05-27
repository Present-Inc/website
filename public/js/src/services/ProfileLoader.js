/**
 * PServices.ProfileLoader
 * Provides and interface to the VideosApiClient to the view controllers
 * Parses and prepares the results provided from the UserApiClient
 *   @dependency {Angular} $q
 *   @dependency {Utilities} logger
 *   @dependency {Present} UsersApiClient
 *   @dependency {Present} Session Manager
 */

PServices.factory('ProfileLoader', ['$q', 'logger', 'UsersApiClient', 'ApiClientResponseHandler', 'UserContextManager',

   function($q, logger, UsersApiClient, ApiClientResponseHandler, UserContextManager) {

     return {

       /**
        * loadProfile
        * Prepares the data from UserApiClient.show to be injected into the view controllers
        */

        loadOwnProfile : function() {

          var loadingProfile = $q.defer();
          var userContext = UserContextManager.getActiveUserContext();

          if(userContext.token && userContext.userId) {
              UsersApiClient.showMe(userContext)
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
          var userContext = UserContextManager.getActiveUserContext();

          UsersApiClient.show(username, userContext)
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
