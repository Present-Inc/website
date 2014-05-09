/*
 * FeedManager.js
 * Defines RewqureJS module for FeedManager directive
 */

define(['./module', function(PServices) {

  /*
   * PServices.FeedManager
   * Service that controls the video feed
   */

   return PServices.factory('FeedManager', [function() {

     function FeedManager() {
        this.active = null;
        this.videos = [];
        this.cursor = -1;
        this.isLoading = false;
        this.needsRefreshed = false;
        this.limit = 10;
      };

      FeedManager.prototype.LoadMoreVideos = {
        homeFeed : function() {
          //Load More Videos
        },
        discoverFeed: function() {
          //Load More Videos
        },
        profileFeed: function() {
          //Load More Videos
        }
      };

      var newFeedManager = new FeedManager();
      return newFeedManager; 

   }]);

}]);
