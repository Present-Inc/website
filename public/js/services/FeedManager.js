/*
 * FeedManager.js
 * Defines RewqureJS module for FeedManager directive
 */

define(['./module', function(PServices) {

  /*
   * PServices.FeedManager
   * Service that controls the video feed
   */

   return PServices.service('FeedManager', [function() {

        //Set default properties for the FeedManager
        this.active = null;
        this.videos = [];
        this.cursor = -1;
        this.isLoading = false;
        this.needsRefreshed = false;
        this.limit = 10;

        //Instance methods on the Feed Manager
        this.loadMoreVideos : {
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

   }]);

}]);
