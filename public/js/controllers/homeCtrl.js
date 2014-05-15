/*
 * homeCtrl.js
 * Defines a RequireJS module for the Home Controller
 */

define(['./module'], function(PControllers) {

    /*
     * PControllers.homeCrtl
     * View Controller for the home state
     *   @dependency {Angular} $scope
     *   @dependency {Utilities} logger -- Configurable logger for development
     *   @dependency {Present} FeedManager -- Provides properties and methods to manage the video feed
     *   @dependency {Present} discoverFeed -- Data resolved from FeedLoader.loadDiscoverFeed
     */

     return PControllers.controller('homeCtrl', ['$scope', 'logger', 'FeedManager', 'homeFeed', 'profile',

       function($scope, logger, FeedManager, homeFeed, profile) {
         //Check whether resolved dedpendencies resolved successfully
         if(!homeFeed) alert('Please log in to views the home feed!');

         logger.debug(['PControllers.homeCtrl -- initializing the Feed Manager', homeFeed]);

         //Initialize Feed Manager on the controller scope
         $scope.FeedManager = FeedManager;
         $scope.FeedManager.type = 'home';
         $scope.FeedManager.cursor = homeFeed.cursor;
         $scope.FeedManager.videos = homeFeed.videos;

         $scope.Profile = profile; 

         $scope.refreshFeed = function() {
           $scope.FeedManager.loadMoreVideos($scope.FeedManager.type, $scope.FeedManager.cursor)
             .then(function(newHomeFeed) {
                $scope.FeedManager.videos = newHomeFeed.videos;
                $scope.FeedManager.cursor = newHomeFeed.cursor;
             })
         }

       }

     ]);

});
