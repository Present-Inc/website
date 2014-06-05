/**
 * PLoaders.ProfileLoader
 * Provides and interface to the VideosApiClient to the view controllers
 * Parses and prepares the results provided from the UserApiClient
 *   @dependency {Angular} $q
 *   @dependency {Utilities} logger
 *   @dependency {Present} UsersApiClient
 *   @dependency {Present} Session Manager
 */

PLoaders.factory('ProfileLoader', ['$q', 'logger', 'UsersApiClient', 'ProfileConstructor', 'UserContextManager',

   function($q, logger, UsersApiClient, ProfileConstructor, UserContextManager) {

     return {

       /**
        * loadProfile
        * Prepares the data from UserApiClient.show to be injected into the view PControllers
        */

        loadOwnProfile : function() {

          var loadingProfile = $q.defer();
          var userContext = UserContextManager.getActiveUserContext();

          if(userContext) {
              UsersApiClient.showMe(userContext)
                .then(function(apiResponse) {
                  var profile = ProfileConstructor.create(apiResponse.result.object);
                  loadingProfile.resolve(profile);
                })
                .catch(function() {
                  loadingProfile.resolve(false);
                });
          } else loadingProfile.resolve(false);

          return loadingProfile.promise;

        },

        loadUserProfile : function(username) {

          var loadingProfile = $q.defer();
          var userContext = UserContextManager.getActiveUserContext();

          UsersApiClient.show(username, userContext)
            .then(function(apiResponse) {
              var profile = ProfileConstructor.create(apiResponse.result.object);
              loadingProfile.resolve(profile);
            })
            .catch(function() {
              //TODO:
              loadingProfile.resolve(false);
            });

          return loadingProfile.promise;

        }

     }
   }

]);
