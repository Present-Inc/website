  /**
   * PLoaders.FeedLoader
   * Provides and interface to the VideosApiClint to the view Controllers
   * Parses and prepares the results provided from the VideoApiClient
   *    @dependency {Angular} $q
   *    @dependency {Utilities} logger
   *    @dependency {Present} VideoApiClient -- Provides an interface to the Present API
   *    @dependency {Present} FeedConstructor -- Constructs the new feed object
   *    @dependency {Present} UserContextManager -- Manages the user userContext data
   */

  PLoaders.factory('FeedLoader', ['$q', 'logger', 'VideosApiClient', 'FeedConstructor', 'UserContextManager',

     function($q, logger, VideosApiClient, FeedConstructor, UserContextManager) {

       return {

          /**
           * loadDiscoverFeed
           * Prepares the data from VideoApiClient.listBrandNew Videos to be injected into the view PControllers
           *   @params <Number> cursor -- video cursor provided to the API
           */

          loadDiscoverFeed : function(cursor) {

            var loadingDiscoverFeed = $q.defer();
            var userContext = UserContextManager.getActiveUserContext();

            VideosApiClient.listBrandNewVideos(cursor, userContext)
              .then(function(apiResponse) {
                var Feed = FeedConstructor.create(apiResponse);
                loadingDiscoverFeed.resolve(Feed);
              })
              .catch(function(apiResponse) {
                //TODO better error handling
                loadingDiscoverFeed.resolve(false)
              });

            return loadingDiscoverFeed.promise;

          },

          /**
           * loadHomeFeed
           * Prepares the data from UsersApiClient.listHomeVideos
           *   @params <Number> cursor -- video cursor provided to the API
           */

          loadHomeFeed : function(cursor) {

            var loadingHomeFeed = $q.defer();
            var userContext = UserContextManager.getActiveUserContext();

            if(userContext) {
              VideosApiClient.listHomeVideos(cursor, userContext)
                .then(function(apiResponse) {
                  var Feed = FeedConstructor.create(apiResponse);
                  loadingHomeFeed.resolve(Feed);
                })
                .catch(function(apiResponse) {
                  //TODO: better error handling
                  loadingHomeFeed.resolve(false);
                });

            } else {
							loadingHomeFeed.resolve();
						}

            return loadingHomeFeed.promise;

          }
        }
      }

  ]);

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
