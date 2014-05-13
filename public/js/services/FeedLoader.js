/*
 * FeedLoader.js
 * Defines a RequireJS Module for the Feed Loader Service
 */

define(['./module'], function(PServices) {

  /* PServices.FeedLoader
   * Provides and interface to the VideosApiClint to the view Controllers
   * Parses and prepares the results provided from the VideoApiClient
   *    @dependency {Angular} $q
   *    @dependency {Present} Logger
   *    @dependency {Present} VideoApiClient -- Provides an interface to the Present API
   *    @dependency {Present} ApiClientResponseHandler -- Parses the raw api responses
   */

   return PServices.factory('FeedLoader', ['$q', 'Logger', 'VideosApiClient', 'ApiClientResponseHandler',

     function($q, Logger, VideosApiClient, ApiClientResponseHandler) {
       return {

           /* loadDiscoverFeed
            * Prepares the data from VideoApiClient.listBrandNew Videos to be injected into the view Controllers
            *   @params <Number> cursor -- video cursor provided to the API
            */

           loadDiscoverFeed : function(cursor) {
               var loadingDiscoverFeed = $q.defer();
               VideosApiClient.listBrandNewVideos(cursor)
                 .then(function(rawApiResponse) {

                   var deserializedFeed = [];

                   for(var i=0; i < rawApiResponse.results.length; i++) {
                     var deserializedVideo = ApiClientResponseHandler.deserializeVideo(rawApiResponse.results[i].object);
                     deserializedVideo.comments.content = ApiClientResponseHandler.deserializeComments(rawApiResponse.results[i].object.comments);
                     deserializedVideo.creator = ApiClientResponseHandler.deserializeCreator(rawApiResponse.results[i].object.creatorUser.object);
                     deserializedFeed.push(deserializedVideo);
                   };

                   Logger.debug(['PServices.FeedLoader -- resolving the discover feed', deserializedFeed]);
                   loadingDiscoverFeed.resolve(deserializedFeed);

                 })
                 .catch(function(VideosApiClientResponse) {
                   loadingDiscoverFeed.resolve(false)

                 })

               return loadingDiscoverFeed.promise;
           }
       }
     }

   ]);

});
