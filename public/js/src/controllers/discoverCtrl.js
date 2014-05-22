/*
 * discoverController.js
 * Defines RequireJS module for discoverCtrl Controller
 */

define(['./module'], function(PControllers) {

  /*
   * PControllers.discoverCtrl
   * View Controller for the discover state
   *   @dependency {Angular} $scope
   *   @dependency {Present} logger   -- Configurable log for development
   *   @dependency {Present} FeedManager -- Provides properties and methods to manage the video feed
   *   @dependency {Present} discoverFeed -- Data resolved from FeedLoader.loadDiscoverFeed
   */

  return PControllers.controller('discoverCtrl', ['$scope', 'logger', 'FeedManager', 'discoverFeed',

    function($scope, logger, FeedManager, discoverFeed) {
      //Check whether resolved dependencies resolved successfully
      if(!discoverFeed) alert('Sorry, it appears that the application has lost connection, please try again');

      logger.debug(['PControllers.discoverCtrl -- initializing the Feed Manager', discoverFeed]);

      //Initialize Feed Manager on the controller scope
      $scope.FeedManager = FeedManager;
      $scope.FeedManager.type = 'discover';
      $scope.FeedManager.cursor = discoverFeed.cursor;
      $scope.FeedManager.videos = discoverFeed.videos;

      //Refreshes the discoverFeed
      $scope.refreshFeed = function() {
        $scope.FeedManager.loadMoreVideos($scope.FeedManager.type, $scope.FeedManager.cursor)
          .then(function(newDiscoverFeed) {
            $scope.FeedManager.videos = newDiscoverFeed.videos;
            $scope.FeedManager.cursor = newDiscoverFeed.cursor;
          });
      }

    }

  ]);

});
