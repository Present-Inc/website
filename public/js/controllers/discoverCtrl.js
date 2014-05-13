/*
 * discoverController.js
 * Defines RequireJS module for discoverCtrl Controller
 */


define(['./module'], function(PControllers) {

  /*
   * PControllers.discoverCtrl
   * Controller for the discover state
   *   @dependency {Angular} $scope
   *   @dependency {Utility} Logger   -- Configurable log for development
   *   @dependency {Present} FeedManager -- Provides properties and methods to manage the video feed
   *   @dependency {Present} discoverFeed -- Data resolved from FeedLoader.loadDiscoverFeed
   *
   *
   */

  var discoverCtrl = PControllers.controller('discoverCtrl', ['$scope', 'Logger', 'FeedManager', 'discoverFeed',

    function($scope, Logger, FeedManager, discoverFeed) {
      //Check whether resolved dependencies resolved successfully
      if(!discoverFeed) alert('Sorry, it appears that the application has lost connection, please try agai');

      //Initialize Feed Manager to
      $scope.FeedManager = FeedManager;
      $scope.FeedManager.videos = discoverFeed;
      Logger.debug(['PControllers.discoverCtrl -- initializing the Feed Manager', $scope.FeedManager]);

    }

  ]);

});
