/**
 * FeedLoader.js
 * Defines a RequireJS Module for the Feed Loader Service
 */

define(['./module'], function(PServices) {

  /**
   * PServices.FeedLoader
   * Provides and interface to the VideosApiClint to the view Controllers
   * Parses and prepares the results provided from the VideoApiClient
   *    @dependency {Angular} $q
   *    @dependency {Utilities} logger
   *    @dependency {Present} VideoApiClient -- Provides an interface to the Present API
   *    @dependency {Present} ApiClientResponseHandler -- Parses the raw api responses
   *    @dependency {Present} SessionManager -- Manages the user session data
   */

   return PServices.factory('FeedLoader', ['$q', 'logger', 'VideosApiClient', 'ApiClientResponseHandler', 'SessionManager',

     function($q, logger, VideosApiClient, ApiClientResponseHandler, SessionManager) {
       return {

           /**
            * loadDiscoverFeed
            * Prepares the data from VideoApiClient.listBrandNew Videos to be injected into the view controllers
            *   @params <Number> cursor -- video cursor provided to the API
            */

           loadDiscoverFeed : function(cursor) {
               var loadingDiscoverFeed = $q.defer();
               VideosApiClient.listBrandNewVideos(cursor)
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

                   logger.debug(['PServices.FeedLoader -- loading the discover feed', deserializedFeed]);
                   loadingDiscoverFeed.resolve(deserializedFeed);

                 })
                 .catch(function(rawApiResponse) {
                   //controller is watching for false return value to display an error feedback message
                   loadingDiscoverFeed.resolve(false)
                 })

               return loadingDiscoverFeed.promise;
           },

           /* loadHomeFeed
            * Prepares the data from the UsersApiClient.listHomeVideos
            */

            loadHomeFeed : function(cursor) {
              var loadingHomeFeed = $q.defer();
              var currentSession = SessionManager.getCurrentSession();
              VideosApiClient.listHomeVideos(currentSession, cursor)
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

                   logger.debug(['PServices.FeedLoader -- loading the discover feed', deserializedFeed]);
                   loadingHomeFeed.resolve(deserializedFeed);

                })
                .catch(function(rawApiResponse) {
                  loadingHomeFeed.resolve(false);
                });

              return loadingHomeFeed.promise;

            }
       }
     }

   ]);

});
