/*
 * FeedManager.js
 * Defines RequireJS module for FeedManager Service
 */

define(['./module'], function(PServices) {

  /*
   * PServices.FeedManager
   * Provides properties and methods to manage the state of Video Feeds
   *   @dependency {Present} Logger
   *   @dependency {Present} FeedLoader -- Loads feed data from the Api Client
   */

   return PServices.factory('FeedManager', ['Logger', 'FeedLoader', function(Logger, FeedLoader) {

         function FeedManager() {
           //Set default properties for the FeedManager
           this.type = '';
           this.activeVideo = null;
           this.videos = [];
           this.cursor = -1;
           this.isLoading = false;
           this.errorMessage = '';
         };

        /* FeedManager.loadMoreVideos
         * Refreshes video feed by mapping the Feed Type to the correct FeedLoader Method
         */

         FeedManager.prototype.loadMoreVideos = function(feedType, cursor, username) {

           this.videos = [];
           this.isLoading = true;

           Logger.test(['PServices.FeedManager -- refreshing feed' , feedType, cursor, username]);

           if(feedType == 'discover') return FeedLoader.loadDiscoverFeed(cursor);

           else if(feedType == 'home') return FeedLoader.loadHomeFeed(cursor, username);

           else if(feedType == 'profile') return FeedLoader.loadProfileFeed(cursor, username);

           else  Logger.error('PServices.FeedManager -- no feed type provided');

         };

         return new FeedManager();
   }]);

});
