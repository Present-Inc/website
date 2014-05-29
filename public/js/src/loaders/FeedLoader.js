  /**
   * PServices.FeedLoader
   * Provides and interface to the VideosApiClint to the view Controllers
   * Parses and prepares the results provided from the VideoApiClient
   *    @dependency {Angular} $q
   *    @dependency {Utilities} logger
   *    @dependency {Present} VideoApiClient -- Provides an interface to the Present API
   *    @dependency {Present} ApiClientResponseHandler -- Parses the raw api responses
   *    @dependency {Present} UserContextManager -- Manages the user userContext data
   */

  PServices.factory('FeedLoader', ['$q', 'logger', 'VideosApiClient', 'Feed', 'UserContextManager',

     function($q, logger, VideosApiClient, ApiClientResponseHandler, Feed, UserContextManager) {

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
              .then(function(rawApiResponse) {
                var Feed = Feed.create();
                loadingDiscoverFeed.resolve(Feed);
              })
              .catch(function(rawApiResponse) {
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
                .then(function(rawApiResponse) {

                  var deserializedFeed = {
                    cursor: rawApiResponse.nextCursor,
                    videos: []
                  };

                  for(var i=0; i < rawApiResponse.results.length; i++) {
                    var deserializedVideo = ApiClientResponseHandler.deserializeVideo(rawApiResponse.results[i].object);
                    deserializedVideo.comments = ApiClientResponseHandler.deserializeComments(rawApiResponse.results[i].object.comments);
                    deserializedVideo.creator = ApiClientResponseHandler.deserializeCreator(rawApiResponse.results[i].object.creatorUser.object);
                    deserializedFeed.videos.push(deserializedVideo);
                  };

                  logger.debug(['PServices.FeedLoader -- loading the home feed', deserializedFeed]);
                  loadingHomeFeed.resolve(deserializedFeed);

                })
                .catch(function(rawApiResponse) {
                  //TODO better error handling
                  loadingHomeFeed.resolve(false);
                });

            } else loadingHomeFeed.resolve(false);

            return loadingHomeFeed.promise;

          }
        }
      }

  ]);