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
           * Prepares the data from VideoApiClient.listBrandNew Videos to be injected into the view controllers
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
            var currentSession = UserContextManager.getActiveUserContext();

            if(currentSession.token && currentSession.userId) {

              VideosApiClient.listHomeVideos(cursor, currentSession)
                .then(function(apiResponse) {
                  var Feed = FeedConstructor.create(apiResponse);
                  loadingHomeFeed.resolve(Feed);
                })
                .catch(function(rawApiResponse) {
                  //TODO better error handling
                  loadingHomeFeed.resolve(false);
                });

            } else {
                loadingHomeFeed.resolve(false);
            }

            return loadingHomeFeed.promise;

          }
        }
      }

  ]);
