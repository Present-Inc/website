  /**
   * PLoaders.FeedLoader
   * Provides and interface to the VideosApiClint to the view Controllers
   * Parses and prepares the results provided from the VideoApiClient
   *    @dependency {Angular} $q
   *    @dependency {Utilities} logger
   *    @dependency {Present} VideoApiClient -- Provides an interface to the Present API
   *    @dependency {Present} ApiClientResponseHandler -- Parses the raw api responses
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

/**
 * PLoaders.ProfileLoader
 * Provides and interface to the VideosApiClient to the view controllers
 * Parses and prepares the results provided from the UserApiClient
 *   @dependency {Angular} $q
 *   @dependency {Utilities} logger
 *   @dependency {Present} UsersApiClient
 *   @dependency {Present} Session Manager
 */

PLoaders.factory('ProfileLoader', ['$q', 'logger', 'UsersApiClient', 'ApiClientResponseHandler', 'UserContextManager',

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
