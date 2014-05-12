/*
 * discoverController.js
 * Defines RequireJS module for discoverCtrl Controller
 */


define(['./module'], function(PControllers) {

  /*
   * PControllers.discoverCtrl
   * Controller for the discover state
   *   @dependency {Angular} $scope
   *   @dependency {Present} FeedManager -- Provides properties and methods to manage the video feed
   *   @dependency {Present} DiscoverFeed -- Data resolved from FeedLoader.loadDiscoverFeed
   *
   */

  var discoverCtrl = PControllers.controller('discoverCtrl', ['$scope', 'FeedManager', 'discoverFeed',

    function($scope, FeedManager, discoverFeed) {
      $scope.discoverFeed = discoverFeed;
      console.log($scope.discoverFeed);
    }

  ]);

});
