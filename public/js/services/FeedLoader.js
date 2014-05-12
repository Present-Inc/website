
/*
 * FeedLoader.js
 * Defines a RequireJS Module for the Feed Loader Service
 */

define(['./module'], function(PServices) {

  /* PServices.FeedLoader
   * Provides and interface to the VideosApiClint to the view Controllers
   * Parses and prepares the results provided from the VideoApiClient
   *    @dependency {Angular} $q
   *    @dependency {Present} VideoApiClient -- Provides an interface to the Present API
   *    @dependency {Present} ApiClientResponseHandler -- Parses the raw api responses
   */

   return PServices.factory('FeedLoader', ['$q', 'VideosApiClient', function($q, VideosApiClient) {
     return {

         /* loadDiscoverFeed
          * Prepares the data from VideoApiClient.listBrandNew Videos to be injected into the view Controllers
          *   @params <Number> cursor -- video cursor provided to the API
          */

         loadDiscoverFeed : function(cursor) {
             var loadingDiscoverFeed = $q.defer();
             VideosApiClient.listBrandNewVideos(cursor)
               .then(function(VideosApiClientResponse) {
                 //Pass The Response to the ApiClientResponseHandler
                 loadingDiscoverFeed.resolve(VideosApiClientResponse);
               })
             return loadingDiscoverFeed.promise;
         }
     }
   }]);

});
